// ============================================================================
//  GALAXIA DEL AMOR — motor del juego en C++ compilado a WebAssembly.
//
//  Para Tamara, mi diosa Freya 💛
//
//  Diseño: C++ freestanding (sin libc ni STL). Toda la memoria es estática y la
//  matemática está implementada a mano, de modo que el .wasm resultante es
//  autocontenido (no necesita imports de JS salvo la propia memoria, que se
//  exporta). El renderizado lo hace JavaScript leyendo el "buffer de dibujo"
//  que rellenamos aquí cada frame.
//
//  Compilación (ver scripts/build-wasm.sh):
//    clang++ --target=wasm32 -O2 -nostdlib -ffreestanding ...
// ============================================================================

typedef __UINTPTR_TYPE__ uptr;

extern "C" {

// ------------------------------------------------------------------ constantes
// Tipos de entidad (coinciden con el array EMO de galaxy-game.js).
enum { T_HEART = 0, T_MSG = 1, T_ROCK = 2, T_SHIELD = 3,
       T_BOOST = 4, T_MAGNET = 5, T_STAR = 6, T_LIFE = 7 };

static const int   MAX_ENT      = 96;   // entidades simultáneas máximas
static const int   FLOATS_PER   = 6;    // por entidad: type,x,y,r,phase,extra
static const int   START_LIVES  = 3;
static const int   MAX_LIVES    = 5;

// ------------------------------------------------------------------ estado
struct Ent {
    int   active;
    int   type;
    float x, y;
    float vx, vy;   // px/seg (base, sin escalar por dificultad)
    float r;
    float phase;    // para oscilación/animación
    float wob;      // amplitud de oscilación vertical
};

static Ent   ents[MAX_ENT];
static float gW = 800.0f, gH = 600.0f;
static float minDim = 600.0f;

static float playerX, playerY, playerTargetY, playerR;
static int   score, lives, best;
static int   state;        // 0 = listo, 1 = jugando, 2 = fin
static float timeAlive;    // segundos jugados en la partida actual
static float diff;         // multiplicador de dificultad (>=1)
static float spawnTimer;   // cuenta atrás para la siguiente aparición

// power-ups activos (segundos restantes)
static float shieldT;
static float boostT;       // puntos x2
static float magnetT;      // atrae coleccionables

// combo: coleccionables seguidos sin chocar
static int   combo, maxCombo;

// eventos del último update() (para que JS dispare sonidos / frases)
static int   lastPickup;   // recogió corazón/mensaje/estrella (suma puntos)
static int   lastMsg;      // recogió un MENSAJE (frase)
static int   lastPower;    // 0 none,1 escudo,2 boost,3 imán,4 estrella,5 vida
static int   lastHit;      // chocó con una roca

static unsigned rngState = 0x2545F491u;

// buffer plano que lee JS para dibujar las entidades
static float renderBuf[MAX_ENT * FLOATS_PER];
static int   renderN;

// --------------------------------------------------------------------- RNG
static unsigned rnd() { rngState = rngState * 1664525u + 1013904223u; return rngState; }
static float frand() { return (float)(rnd() >> 8) * (1.0f / 16777216.0f); } // [0,1)
static float rrange(float a, float b) { return a + (b - a) * frand(); }

// --------------------------------------------------------------------- math
static float absf(float x) { return x < 0.0f ? -x : x; }
static float fsqrt(float x) { return __builtin_sqrtf(x); }

// Aproximación de seno (suficiente para oscilaciones visuales). x en radianes.
static float fsin(float x) {
    const float PI = 3.14159265f, TWO_PI = 6.28318531f;
    while (x >  PI) x -= TWO_PI;
    while (x < -PI) x += TWO_PI;
    const float B = 1.27323954f;   // 4/PI
    const float C = 0.405284735f;  // 4/PI^2
    float y = B * x - C * x * absf(x);
    y = 0.225f * (y * absf(y) - y) + y; // refinamiento
    return y;
}

// --------------------------------------------------------------- utilidades
static void clampPlayer() {
    float lo = playerR, hi = gH - playerR;
    if (playerY < lo) playerY = lo;
    if (playerY > hi) playerY = hi;
}

static int findSlot() {
    for (int i = 0; i < MAX_ENT; i++) if (!ents[i].active) return i;
    return -1;
}

static void spawn() {
    int i = findSlot();
    if (i < 0) return;
    Ent& e = ents[i];
    e.active = 1;
    e.phase  = rrange(0.0f, 6.28318531f);
    e.x      = gW + minDim * 0.06f;
    e.y      = rrange(gH * 0.12f, gH * 0.88f);
    e.wob    = 0.0f;

    float base = gW * 0.34f;            // velocidad horizontal base

    // Vida de recuperación 💗: aparece de vez en cuando, y MÁS cuanto menos vida
    // te quede, para poder recuperarte tras los golpes.
    if (lives < MAX_LIVES) {
        float lifeChance = 0.05f + (float)(START_LIVES - lives) * 0.05f;
        if (lifeChance < 0.05f) lifeChance = 0.05f;
        if (frand() < lifeChance) {
            e.type = T_LIFE; e.r = minDim * 0.040f; e.vx = base * rrange(0.85f, 1.0f); e.wob = minDim * 0.05f;
            return;
        }
    }

    float roll = frand();
    if (roll < 0.42f) {                 // corazón (común)
        e.type = T_HEART;  e.r = minDim * 0.032f; e.vx = base * rrange(0.9f, 1.1f); e.wob = minDim * 0.05f;
    } else if (roll < 0.55f) {          // mensaje de amor (puntúa más)
        e.type = T_MSG;    e.r = minDim * 0.040f; e.vx = base * rrange(0.8f, 1.0f); e.wob = minDim * 0.07f;
    } else if (roll < 0.61f) {          // estrella (coleccionable raro, +50)
        e.type = T_STAR;   e.r = minDim * 0.042f; e.vx = base * rrange(0.85f, 1.05f); e.wob = minDim * 0.06f;
    } else if (roll < 0.86f) {          // roca / asteroide (peligro)
        e.type = T_ROCK;   e.r = minDim * rrange(0.038f, 0.060f); e.vx = base * rrange(1.0f, 1.35f);
    } else {                            // power-ups (raros): elegir uno
        float pr = frand();
        if      (pr < 0.34f) { e.type = T_SHIELD; e.r = minDim * 0.036f; }
        else if (pr < 0.64f) { e.type = T_BOOST;  e.r = minDim * 0.036f; }
        else                 { e.type = T_MAGNET; e.r = minDim * 0.036f; }
        e.vx = base * rrange(0.85f, 1.05f); e.wob = minDim * 0.045f;
    }
}

static void resetGame() {
    for (int i = 0; i < MAX_ENT; i++) ents[i].active = 0;
    score = 0;
    lives = START_LIVES;
    timeAlive = 0.0f;
    diff = 1.0f;
    spawnTimer = 0.6f;
    shieldT = boostT = magnetT = 0.0f;
    combo = maxCombo = 0;
    lastPickup = lastMsg = lastPower = lastHit = 0;
    playerX = gW * 0.18f;
    playerY = gH * 0.5f;
    playerTargetY = playerY;
    playerR = minDim * 0.045f;
}

static int circlesHit(float ax, float ay, float ar, float bx, float by, float br) {
    float dx = ax - bx, dy = ay - by;
    float rr = (ar + br);
    return (dx * dx + dy * dy) <= rr * rr;
}

// Suma puntos por coleccionable aplicando el multiplicador de boost y combo.
static void addPoints(int base) {
    int mult = (boostT > 0.0f) ? 2 : 1;
    combo++;
    if (combo > maxCombo) maxCombo = combo;
    int comboBonus = combo / 5;        // cada 5 de combo, +1 por pieza
    score += (base + comboBonus) * mult;
    lastPickup = 1;
}

// ============================================================ API exportada

__attribute__((export_name("init")))
void init(unsigned seed, float w, float h) {
    if (seed) rngState = seed | 1u;
    gW = w; gH = h;
    minDim = w < h ? w : h;
    // 'best' (récord) se conserva deliberadamente entre partidas.
    resetGame();
    state = 0; // listo (pantalla de inicio)
}

__attribute__((export_name("resize")))
void resize(float w, float h) {
    float fx = (gW > 0.0f) ? w / gW : 1.0f;
    float fy = (gH > 0.0f) ? h / gH : 1.0f;
    for (int i = 0; i < MAX_ENT; i++) if (ents[i].active) { ents[i].x *= fx; ents[i].y *= fy; }
    playerY *= fy; playerTargetY *= fy;
    gW = w; gH = h; minDim = w < h ? w : h;
    playerX = gW * 0.18f;
    playerR = minDim * 0.045f;
    clampPlayer();
}

__attribute__((export_name("start")))
void start(unsigned seed) {
    if (seed) rngState = seed | 1u;
    resetGame();
    state = 1;
}

__attribute__((export_name("setPointer")))
void setPointer(float y) { playerTargetY = y; }

// Avanza la simulación dt segundos. Devuelve el estado (0/1/2).
__attribute__((export_name("update")))
int update(float dt) {
    lastPickup = lastMsg = lastPower = lastHit = 0;
    if (dt > 0.05f) dt = 0.05f; // estabilidad si hay lag

    if (state == 1) {
        timeAlive += dt;
        diff = 1.0f + timeAlive * 0.035f;
        if (diff > 3.2f) diff = 3.2f;

        float k = dt * 11.0f; if (k > 1.0f) k = 1.0f;
        playerY += (playerTargetY - playerY) * k;
        clampPlayer();

        if (shieldT > 0.0f) shieldT -= dt;
        if (boostT  > 0.0f) boostT  -= dt;
        if (magnetT > 0.0f) magnetT -= dt;

        spawnTimer -= dt;
        if (spawnTimer <= 0.0f) {
            spawn();
            spawnTimer = rrange(0.45f, 1.0f) / diff;
        }

        for (int i = 0; i < MAX_ENT; i++) {
            Ent& e = ents[i];
            if (!e.active) continue;
            e.x -= e.vx * diff * dt;
            e.phase += dt * 3.0f;

            int collectible = (e.type == T_HEART || e.type == T_MSG || e.type == T_STAR);
            // Imán: atrae los coleccionables hacia la nave.
            if (magnetT > 0.0f && collectible) {
                float adx = playerX - e.x, ady = playerY - e.y;
                float d = fsqrt(adx * adx + ady * ady) + 0.001f;
                float pull = minDim * 4.2f * dt;
                e.x += adx / d * pull;
                e.y += ady / d * pull;
            }

            float drawY = e.y + (e.wob > 0.0f ? fsin(e.phase) * e.wob : 0.0f);

            if (circlesHit(playerX, playerY, playerR, e.x, drawY, e.r)) {
                switch (e.type) {
                    case T_HEART:  addPoints(10); e.active = 0; continue;
                    case T_MSG:    addPoints(30); lastMsg = 1; e.active = 0; continue;
                    case T_STAR:   addPoints(50); lastPower = 4; e.active = 0; continue;
                    case T_SHIELD: shieldT = 6.0f; lastPower = 1; e.active = 0; continue;
                    case T_BOOST:  boostT  = 7.0f; lastPower = 2; e.active = 0; continue;
                    case T_MAGNET: magnetT = 6.0f; lastPower = 3; e.active = 0; continue;
                    case T_LIFE:   if (lives < MAX_LIVES) lives++; lastPower = 5; e.active = 0; continue;
                    case T_ROCK:
                        if (shieldT > 0.0f) { shieldT = 0.0f; e.active = 0; continue; }
                        lives--; lastHit = 1; combo = 0; e.active = 0;
                        if (lives <= 0) { lives = 0; if (score > best) best = score; state = 2; }
                        continue;
                }
            }
            if (e.x < -e.r * 2.0f) e.active = 0; // fuera de pantalla
        }
    }

    // Construir buffer de dibujo
    renderN = 0;
    float* p = renderBuf;
    for (int i = 0; i < MAX_ENT; i++) {
        Ent& e = ents[i];
        if (!e.active) continue;
        float drawY = e.y + (e.wob > 0.0f ? fsin(e.phase) * e.wob : 0.0f);
        p[0] = (float)e.type;
        p[1] = e.x;
        p[2] = drawY;
        p[3] = e.r;
        p[4] = e.phase;
        p[5] = 0.0f;
        p += FLOATS_PER;
        renderN++;
    }
    return state;
}

// ---- getters para el HUD / render ----
__attribute__((export_name("getState")))   int   getState()   { return state; }
__attribute__((export_name("getScore")))   int   getScore()   { return score; }
__attribute__((export_name("getLives")))   int   getLives()   { return lives; }
__attribute__((export_name("getBest")))    int   getBest()    { return best; }
__attribute__((export_name("getCombo")))   int   getCombo()   { return combo; }
__attribute__((export_name("getMaxCombo")))int   getMaxCombo(){ return maxCombo; }
__attribute__((export_name("getShield")))  int   getShield()  { return shieldT > 0.0f ? 1 : 0; }
__attribute__((export_name("shieldPct")))  float shieldPct()  { return shieldT > 0.0f ? shieldT / 6.0f : 0.0f; }
__attribute__((export_name("getBoost")))   int   getBoost()   { return boostT  > 0.0f ? 1 : 0; }
__attribute__((export_name("boostPct")))   float boostPct()   { return boostT  > 0.0f ? boostT  / 7.0f : 0.0f; }
__attribute__((export_name("getMagnet")))  int   getMagnet()  { return magnetT > 0.0f ? 1 : 0; }
__attribute__((export_name("magnetPct")))  float magnetPct()  { return magnetT > 0.0f ? magnetT / 6.0f : 0.0f; }
__attribute__((export_name("playerXf")))   float playerXf()   { return playerX; }
__attribute__((export_name("playerYf")))   float playerYf()   { return playerY; }
__attribute__((export_name("playerRf")))   float playerRf()   { return playerR; }

// Eventos del último update()
__attribute__((export_name("evtPickup")))  int   evtPickup()  { return lastPickup; }
__attribute__((export_name("evtMsg")))     int   evtMsg()     { return lastMsg; }
__attribute__((export_name("evtPower")))   int   evtPower()   { return lastPower; }
__attribute__((export_name("evtHit")))     int   evtHit()     { return lastHit; }

// Buffer de dibujo
__attribute__((export_name("renderPtr")))   int renderPtr()   { return (int)(uptr)renderBuf; }
__attribute__((export_name("renderCount"))) int renderCount() { return renderN; }
__attribute__((export_name("floatsPer")))   int floatsPer()   { return FLOATS_PER; }

} // extern "C"

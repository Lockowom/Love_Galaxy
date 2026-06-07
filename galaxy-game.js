// ================================================
// GALAXIA DEL AMOR — juego arcade (versión pulida)
// Vuela con tu corazón, captura corazones y mensajes de amor,
// evita los obstáculos, consigue power-ups y haz combos.
// Controles: ratón / dedo (arrastra) / flechas o WASD. P = pausa.
// ================================================

class GalaxyLoveGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.dpr = window.devicePixelRatio || 1;
        this.width = 0;
        this.height = 0;

        this.state = 'start';        // 'start' | 'playing' | 'paused' | 'over'
        this.rafId = null;
        this.lastTs = 0;

        this.highScore = 0;
        this.loadHighScore();

        this.loveMessages = [
            "Te Amo", "Eres Mi Vida", "Mi Corazón Es Tuyo", "Amor Eterno",
            "Juntos Por Siempre", "Eres Mi Todo", "Mi Alma Gemela", "Te Adoro",
            "Mi Inspiración", "Eres Perfecta", "Contigo Soy Feliz", "Mi Estrella",
            "Eres Mi Luz", "Mi Tesoro", "Eres Única", "Eres Mi Paraíso",
            "Mi Ángel", "Eres Magia", "Mi Razón de Vivir", "Te Amo Más Cada Día"
        ];

        this.powerTypes = [
            { type: 'shield', emoji: '🛡️', name: 'Escudo' },
            { type: 'magnet', emoji: '🧲', name: 'Imán' },
            { type: 'x2',     emoji: '⭐', name: 'Puntos x2' },
            { type: 'slow',   emoji: '🐌', name: 'Cámara lenta' },
            { type: 'life',   emoji: '❤️', name: 'Vida extra' }
        ];

        // Vínculos de eventos (para poder removerlos)
        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerDown = this._onPointerDown.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onResize = this._onResize.bind(this);
        this._loop = this._loop.bind(this);
    }

    async loadHighScore() {
        try {
            if (window.db && window.db.getHighScore) {
                this.highScore = await window.db.getHighScore('galaxyLove') || 0;
            } else {
                this.highScore = parseInt(localStorage.getItem('galaxyLoveHighScore')) || 0;
            }
        } catch (e) { this.highScore = 0; }
    }

    // ----------------------------------------------------------------
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        this.container = container;
        container.innerHTML = '';

        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'display:block; touch-action:none; cursor:none; border-radius:0;';
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this._resizeToContainer();

        // Listeners
        this.canvas.addEventListener('pointermove', this._onPointerMove);
        this.canvas.addEventListener('pointerdown', this._onPointerDown);
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
        window.addEventListener('resize', this._onResize);

        this._initStars();
        this._resetGame();
        this.state = 'start';

        // Arrancar el bucle
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.lastTs = performance.now();
        this.rafId = requestAnimationFrame(this._loop);
    }

    destroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
        if (this.canvas) {
            this.canvas.removeEventListener('pointermove', this._onPointerMove);
            this.canvas.removeEventListener('pointerdown', this._onPointerDown);
        }
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        window.removeEventListener('resize', this._onResize);
    }

    _resizeToContainer() {
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(320, Math.floor(rect.width));
        this.height = Math.max(360, Math.floor(rect.height));
        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    _onResize() {
        if (!this.canvas) return;
        this._resizeToContainer();
        this._initStars();
        // Mantener al jugador dentro
        if (this.player) {
            this.player.x = Math.min(this.player.x, this.width - 30);
            this.player.y = Math.min(this.player.y, this.height - 30);
        }
    }

    _initStars() {
        this.stars = [];
        const n = Math.floor((this.width * this.height) / 9000);
        for (let i = 0; i < n; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() * 1.6 + 0.3,
                tw: Math.random() * Math.PI * 2,
                sp: Math.random() * 18 + 6
            });
        }
    }

    _resetGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.combo = 0;
        this.comboTimer = 0;
        this.maxCombo = 0;
        this.time = 0;
        this.spawnTimer = 0;
        this.items = [];
        this.particles = [];
        this.effects = { shield: 0, magnet: 0, x2: 0, slow: 0 };
        this.keys = {};
        this.player = {
            x: this.width / 2,
            y: this.height * 0.75,
            r: 24,
            tx: this.width / 2,
            ty: this.height * 0.75,
            trail: []
        };
    }

    // ----------------------- INPUT -----------------------
    _pointerPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    _onPointerMove(e) {
        if (this.state !== 'playing') return;
        const p = this._pointerPos(e);
        this.player.tx = p.x;
        this.player.ty = p.y;
    }
    _onPointerDown(e) {
        if (this.state === 'start') { this._startGame(); return; }
        if (this.state === 'over') { this._startGame(); return; }
        if (this.state === 'paused') { this.state = 'playing'; return; }
        if (this.state === 'playing') {
            const p = this._pointerPos(e);
            this.player.tx = p.x;
            this.player.ty = p.y;
        }
    }
    _onKeyDown(e) {
        // Solo actuar si el juego está visible
        const modal = document.getElementById('galaxy-game-modal');
        if (!modal || !modal.classList.contains('active')) return;

        if (e.key === 'p' || e.key === 'P') {
            if (this.state === 'playing') this.state = 'paused';
            else if (this.state === 'paused') this.state = 'playing';
            return;
        }
        if ((e.key === 'Enter' || e.key === ' ') && (this.state === 'start' || this.state === 'over')) {
            this._startGame();
            e.preventDefault();
            return;
        }
        this.keys[e.key] = true;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    }
    _onKeyUp(e) { this.keys[e.key] = false; }

    _startGame() {
        this._resetGame();
        this.state = 'playing';
    }

    // ----------------------- LÓGICA -----------------------
    _spawn() {
        const r = Math.random();
        let kind;
        if (r < 0.62) kind = 'heart';
        else if (r < 0.78) kind = 'message';
        else if (r < 0.95) kind = 'bad';
        else kind = 'power';

        // Posición y velocidad desde un borde aleatorio hacia el interior
        const speed = (1.1 + this.level * 0.18) * (this.effects.slow > 0 ? 0.45 : 1);
        const edge = Math.floor(Math.random() * 4);
        let x, y, vx, vy;
        const m = 40;
        if (edge === 0) { x = Math.random() * this.width; y = -m; }
        else if (edge === 1) { x = this.width + m; y = Math.random() * this.height; }
        else if (edge === 2) { x = Math.random() * this.width; y = this.height + m; }
        else { x = -m; y = Math.random() * this.height; }
        // Velocidad hacia una zona central con algo de aleatoriedad
        const cx = this.width * (0.3 + Math.random() * 0.4);
        const cy = this.height * (0.3 + Math.random() * 0.4);
        const ang = Math.atan2(cy - y, cx - x);
        vx = Math.cos(ang) * speed;
        vy = Math.sin(ang) * speed;

        const item = { kind, x, y, vx, vy, r: 18, rot: 0, vr: (Math.random() - 0.5) * 0.05 };
        if (kind === 'heart') { item.emoji = ['💖', '💗', '💕', '💝'][Math.floor(Math.random() * 4)]; item.r = 18; }
        else if (kind === 'message') { item.emoji = '💌'; item.text = this.loveMessages[Math.floor(Math.random() * this.loveMessages.length)]; item.r = 20; }
        else if (kind === 'bad') { item.emoji = ['💔', '☄️', '🪨'][Math.floor(Math.random() * 3)]; item.r = 20; }
        else { const p = this.powerTypes[Math.floor(Math.random() * this.powerTypes.length)]; item.emoji = p.emoji; item.power = p.type; item.name = p.name; item.r = 19; }
        this.items.push(item);
    }

    _addParticles(x, y, color, n = 10) {
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const sp = Math.random() * 3 + 1;
            this.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, color, r: Math.random() * 3 + 1.5 });
        }
    }

    _update(dt) {
        if (this.state !== 'playing') return;
        this.time += dt;

        // Nivel sube cada 18s o cada 25 corazones aprox
        this.level = 1 + Math.floor(this.time / 18) + Math.floor(this.score / 400);

        // Combo decae
        if (this.comboTimer > 0) { this.comboTimer -= dt; if (this.comboTimer <= 0) this.combo = 0; }

        // Efectos decaen
        for (const k of ['shield', 'magnet', 'x2', 'slow']) {
            if (this.effects[k] > 0) this.effects[k] = Math.max(0, this.effects[k] - dt);
        }

        // Movimiento del jugador: teclado mueve el objetivo; el cuerpo sigue suave
        const ks = 7;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) this.player.tx -= ks;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) this.player.tx += ks;
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) this.player.ty -= ks;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) this.player.ty += ks;
        this.player.tx = Math.max(this.player.r, Math.min(this.width - this.player.r, this.player.tx));
        this.player.ty = Math.max(this.player.r, Math.min(this.height - this.player.r, this.player.ty));
        this.player.x += (this.player.tx - this.player.x) * 0.2;
        this.player.y += (this.player.ty - this.player.y) * 0.2;

        // Estela
        this.player.trail.push({ x: this.player.x, y: this.player.y });
        if (this.player.trail.length > 12) this.player.trail.shift();

        // Spawn
        this.spawnTimer -= dt;
        const interval = Math.max(0.35, 0.95 - this.level * 0.05);
        if (this.spawnTimer <= 0) { this._spawn(); this.spawnTimer = interval; }

        // Actualizar items
        const slowF = this.effects.slow > 0 ? 0.45 : 1;
        for (let i = this.items.length - 1; i >= 0; i--) {
            const it = this.items[i];
            // Imán: atrae corazones/mensajes
            if (this.effects.magnet > 0 && (it.kind === 'heart' || it.kind === 'message')) {
                const dx = this.player.x - it.x, dy = this.player.y - it.y;
                const d = Math.hypot(dx, dy) || 1;
                if (d < 260) { it.vx += (dx / d) * 0.6; it.vy += (dy / d) * 0.6; }
            }
            it.x += it.vx * slowF * dt * 60;
            it.y += it.vy * slowF * dt * 60;
            it.rot += it.vr;

            // Fuera de pantalla
            if (it.x < -60 || it.x > this.width + 60 || it.y < -60 || it.y > this.height + 60) {
                this.items.splice(i, 1);
                continue;
            }

            // Colisión con jugador
            const dist = Math.hypot(this.player.x - it.x, this.player.y - it.y);
            if (dist < this.player.r + it.r - 6) {
                this._collide(it);
                this.items.splice(i, 1);
            }
        }

        // Partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= dt * 1.6;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    _collide(it) {
        if (it.kind === 'heart') {
            this.combo++; this.comboTimer = 2.5; this.maxCombo = Math.max(this.maxCombo, this.combo);
            const base = 10 + Math.min(this.combo, 10) * 2;
            this.score += base * (this.effects.x2 > 0 ? 2 : 1);
            this._addParticles(it.x, it.y, '#e29bb0', 10);
        } else if (it.kind === 'message') {
            this.combo++; this.comboTimer = 2.5; this.maxCombo = Math.max(this.maxCombo, this.combo);
            this.score += 30 * (this.effects.x2 > 0 ? 2 : 1);
            this._addParticles(it.x, it.y, '#c9b3d9', 16);
            this._float(it.text || 'Te Amo', it.x, it.y);
        } else if (it.kind === 'power') {
            this._applyPower(it.power, it.name);
            this._addParticles(it.x, it.y, '#f0bfa8', 18);
        } else { // bad
            if (this.effects.shield > 0) {
                this.effects.shield = 0; // el escudo absorbe el golpe
                this._addParticles(it.x, it.y, '#9fd8e6', 18);
                this._float('🛡️ ¡Escudo!', it.x, it.y);
            } else {
                this.lives--; this.combo = 0;
                this._addParticles(this.player.x, this.player.y, '#e08a8a', 20);
                this._float('💔', it.x, it.y);
                if (this.lives <= 0) this._gameOver();
            }
        }
    }

    _applyPower(type, name) {
        if (type === 'life') { this.lives = Math.min(5, this.lives + 1); }
        else if (type === 'shield') this.effects.shield = 6;
        else if (type === 'magnet') this.effects.magnet = 7;
        else if (type === 'x2') this.effects.x2 = 9;
        else if (type === 'slow') this.effects.slow = 5;
        this._float('✨ ' + (name || ''), this.player.x, this.player.y - 30);
    }

    _float(text, x, y) {
        this.particles.push({ x, y, vx: 0, vy: -0.6, life: 1.2, color: '#fff', text, r: 0, isText: true });
    }

    async _gameOver() {
        this.state = 'over';
        if (this.score > this.highScore) this.highScore = this.score;
        try {
            if (window.db && window.db.saveGameScore) {
                await window.db.saveGameScore('galaxyLove', this.score, { level: this.level, maxCombo: this.maxCombo });
            } else {
                const prev = parseInt(localStorage.getItem('galaxyLoveHighScore')) || 0;
                if (this.score > prev) localStorage.setItem('galaxyLoveHighScore', String(this.score));
            }
            if (window.achievements && window.achievements.unlock) window.achievements.unlock('galaxy_explorer');
        } catch (e) { /* noop */ }
    }

    // ----------------------- DIBUJO -----------------------
    _loop(ts) {
        const dt = Math.min(0.05, (ts - this.lastTs) / 1000) || 0;
        this.lastTs = ts;
        this._update(dt);
        this._draw(dt);
        this.rafId = requestAnimationFrame(this._loop);
    }

    _draw(dt) {
        const ctx = this.ctx;
        if (!ctx) return;

        // Fondo: degradado plomo/ciruela suave
        const g = ctx.createLinearGradient(0, 0, 0, this.height);
        g.addColorStop(0, '#241a30');
        g.addColorStop(1, '#171022');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.width, this.height);

        // Estrellas
        for (const s of this.stars) {
            s.tw += dt * 3;
            s.y += s.sp * dt;
            if (s.y > this.height) s.y = 0;
            const a = 0.4 + Math.abs(Math.sin(s.tw)) * 0.6;
            ctx.globalAlpha = a;
            ctx.fillStyle = '#f3e6ee';
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        if (this.state === 'start') { this._drawStart(); return; }

        // Items
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const it of this.items) {
            ctx.save();
            ctx.translate(it.x, it.y);
            ctx.rotate(it.rot);
            ctx.font = (it.r * 2) + 'px serif';
            ctx.fillText(it.emoji, 0, 2);
            ctx.restore();
        }

        // Estela del jugador
        for (let i = 0; i < this.player.trail.length; i++) {
            const t = this.player.trail[i];
            ctx.globalAlpha = (i / this.player.trail.length) * 0.35;
            ctx.fillStyle = '#e29bb0';
            ctx.beginPath(); ctx.arc(t.x, t.y, 10 * (i / this.player.trail.length), 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Jugador (con halo de escudo si aplica)
        if (this.effects.shield > 0) {
            ctx.strokeStyle = 'rgba(159,216,230,0.9)';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(this.player.x, this.player.y, this.player.r + 8, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.font = (this.player.r * 2) + 'px serif';
        ctx.fillText('💖', this.player.x, this.player.y + 2);

        // Partículas y textos flotantes
        for (const p of this.particles) {
            if (p.isText) {
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillStyle = '#fdeef1';
                ctx.font = 'bold 16px Poppins, sans-serif';
                ctx.fillText(p.text, p.x, p.y);
            } else {
                ctx.globalAlpha = Math.max(0, p.life);
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            }
        }
        ctx.globalAlpha = 1;

        this._drawHUD();
        if (this.state === 'paused') this._drawCenterPanel('Pausa', 'Pulsa P o toca para continuar');
        if (this.state === 'over') this._drawGameOver();
    }

    _drawHUD() {
        const ctx = this.ctx;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#fdeef1';
        ctx.font = 'bold 20px Poppins, sans-serif';
        ctx.fillText('💞 ' + this.score, 16, 14);
        ctx.font = '13px Poppins, sans-serif';
        ctx.fillStyle = 'rgba(253,238,241,0.85)';
        ctx.fillText('Nivel ' + this.level + (this.combo > 1 ? '   🔥 x' + this.combo : ''), 16, 40);
        ctx.fillText('Récord: ' + this.highScore, 16, 58);

        // Vidas
        ctx.textAlign = 'right';
        ctx.font = '18px serif';
        let hearts = '';
        for (let i = 0; i < this.lives; i++) hearts += '❤️';
        ctx.fillText(hearts || '—', this.width - 14, 16);

        // Efectos activos
        ctx.font = '14px serif';
        let fx = '';
        if (this.effects.shield > 0) fx += '🛡️';
        if (this.effects.magnet > 0) fx += '🧲';
        if (this.effects.x2 > 0) fx += '⭐';
        if (this.effects.slow > 0) fx += '🐌';
        if (fx) ctx.fillText(fx, this.width - 14, 42);
    }

    _drawStart() {
        const ctx = this.ctx;
        this._dim();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fdeef1';
        ctx.font = 'bold 34px "Playfair Display", serif';
        ctx.fillText('🌌 Galaxia del Amor', this.width / 2, this.height / 2 - 70);
        ctx.font = '16px Poppins, sans-serif';
        ctx.fillStyle = 'rgba(253,238,241,0.9)';
        ctx.fillText('Captura 💖 y 💌, evita 💔☄️, atrapa power-ups', this.width / 2, this.height / 2 - 24);
        ctx.fillText('Ratón / dedo / flechas para moverte · P para pausar', this.width / 2, this.height / 2 + 2);
        ctx.fillText('Récord: ' + this.highScore, this.width / 2, this.height / 2 + 30);
        this._drawButton('▶  Jugar', this.width / 2, this.height / 2 + 78);
    }

    _drawGameOver() {
        const ctx = this.ctx;
        this._dim();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fdeef1';
        ctx.font = 'bold 32px "Playfair Display", serif';
        ctx.fillText('Fin de la partida 💔', this.width / 2, this.height / 2 - 70);
        ctx.font = '20px Poppins, sans-serif';
        ctx.fillText('Puntuación: ' + this.score, this.width / 2, this.height / 2 - 26);
        ctx.font = '15px Poppins, sans-serif';
        ctx.fillStyle = 'rgba(253,238,241,0.9)';
        const best = this.score >= this.highScore ? '🏆 ¡Nuevo récord!' : 'Récord: ' + this.highScore;
        ctx.fillText(best, this.width / 2, this.height / 2 + 2);
        ctx.fillText('Combo máx: x' + this.maxCombo + ' · Nivel ' + this.level, this.width / 2, this.height / 2 + 26);
        this._drawButton('↻  Jugar de nuevo', this.width / 2, this.height / 2 + 78);
    }

    _drawCenterPanel(title, sub) {
        const ctx = this.ctx;
        this._dim();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fdeef1';
        ctx.font = 'bold 30px "Playfair Display", serif';
        ctx.fillText(title, this.width / 2, this.height / 2 - 10);
        ctx.font = '15px Poppins, sans-serif';
        ctx.fillStyle = 'rgba(253,238,241,0.85)';
        ctx.fillText(sub, this.width / 2, this.height / 2 + 24);
    }

    _drawButton(label, cx, cy) {
        const ctx = this.ctx;
        const w = 220, h = 54;
        ctx.fillStyle = '#d98aa3';
        this._roundRect(cx - w / 2, cy - h / 2, w, h, 27);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, cx, cy + 1);
    }

    _roundRect(x, y, w, h, r) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    _dim() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(20, 12, 28, 0.55)';
        ctx.fillRect(0, 0, this.width, this.height);
    }
}

// ----------------------- API GLOBAL -----------------------
let galaxyGame = null;

function startGalaxyLoveGame() {
    const modal = document.getElementById('galaxy-game-modal');
    if (!modal) return;
    modal.classList.add('active');
    modal.classList.add('full-screen');
    void modal.offsetWidth; // forzar reflow para medir el contenedor

    if (!galaxyGame) galaxyGame = new GalaxyLoveGame();
    setTimeout(() => galaxyGame.init('galaxy-game-container'), 80);
}

function closeGalaxyGame() {
    const modal = document.getElementById('galaxy-game-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('full-screen');
    }
    if (galaxyGame) galaxyGame.destroy();
}

window.startGalaxyLoveGame = startGalaxyLoveGame;
window.closeGalaxyGame = closeGalaxyGame;

/**
 * Tests de humo (Jest + jsdom) + test del motor WebAssembly del juego.
 *
 * - Capa de datos (window.db) y juego de galaxia (window.startGalaxyLoveGame)
 *   se registran al cargar sus scripts clásicos en jsdom.
 * - El motor C++→WASM (galaxy.wasm) se instancia en Node y se valida su lógica
 *   (init/start/update, puntuación, formato del buffer de dibujo).
 * No requiere red ni Supabase real.
 */
const fs = require('fs');
const path = require('path');

function loadClassicScript(file) {
    const src = fs.readFileSync(path.join(__dirname, file), 'utf8');
    // window.eval ejecuta el código en el ámbito global de jsdom, de modo que
    // `window.db = ...` y `window.startGalaxyLoveGame = ...` quedan disponibles.
    window.eval(src);
}

describe('Love Galaxy — smoke test', () => {
    beforeAll(() => {
        loadClassicScript('db.js');
        loadClassicScript('galaxy-game.js');
    });

    test('window.db existe y expone métodos clave', () => {
        expect(window.db).toBeDefined();
        expect(typeof window.db).toBe('object');
        expect(typeof window.db.getPhotos).toBe('function');
        expect(typeof window.db.getPlaylist).toBe('function');
        expect(typeof window.db.getTimelineEvents).toBe('function');
        expect(typeof window.db.saveGameScore).toBe('function');
    });

    test('el juego de galaxia se registra en window', () => {
        expect(typeof window.startGalaxyLoveGame).toBe('function');
        expect(typeof window.closeGalaxyGame).toBe('function');
        expect(window.GalaxyGame).toBeDefined();
    });

    test('window.LG_BUILD está definido (marca de versión)', () => {
        expect(window.LG_BUILD).toBeDefined();
    });
});

describe('Galaxia del Amor — motor C++ → WebAssembly', () => {
    let ex, memory;

    beforeAll(async () => {
        const bytes = fs.readFileSync(path.join(__dirname, 'galaxy.wasm'));
        const { instance } = await WebAssembly.instantiate(bytes, {});
        ex = instance.exports;
        memory = ex.memory;
    });

    test('exporta la API esperada', () => {
        ['init', 'start', 'update', 'setPointer', 'getState', 'getScore', 'getLives',
         'getBest', 'getShield', 'playerXf', 'playerYf', 'playerRf',
         'renderPtr', 'renderCount', 'floatsPer', 'memory']
            .forEach((name) => expect(ex[name]).toBeDefined());
    });

    test('init deja el juego listo y start lo pone en marcha', () => {
        ex.init(12345, 800, 600);
        expect(ex.getState()).toBe(0);
        expect(ex.getLives()).toBe(3);
        expect(ex.getScore()).toBe(0);
        ex.start(999);
        expect(ex.getState()).toBe(1);
        expect(ex.getLives()).toBe(3);
    });

    test('simular una partida no crashea y produce entidades válidas', () => {
        ex.init(777, 800, 600);
        ex.start(777);
        let maxEnts = 0, ended = false;
        for (let f = 0; f < 60 * 60; f++) {
            if (f % 15 === 0) ex.setPointer(50 + Math.random() * 500);
            const st = ex.update(1 / 60);
            maxEnts = Math.max(maxEnts, ex.renderCount());
            if (st === 2) { ended = true; break; }
        }
        expect(maxEnts).toBeGreaterThan(0);
        // Con movimiento aleatorio el juego termina (choca) o sobrevive: ambos válidos.
        expect([1, 2]).toContain(ex.getState());
        expect(ex.getBest()).toBeGreaterThanOrEqual(0);
        void ended;
    });

    test('el buffer de dibujo tiene tipos y coordenadas válidas', () => {
        ex.init(55, 800, 600);
        ex.start(55);
        for (let i = 0; i < 180; i++) ex.update(1 / 60);
        const ptr = ex.renderPtr(), cnt = ex.renderCount(), fp = ex.floatsPer();
        expect(fp).toBe(6);
        const buf = new Float32Array(memory.buffer, ptr, cnt * fp);
        for (let i = 0; i < cnt; i++) {
            const type = buf[i * fp];
            const r = buf[i * fp + 3];
            expect(type).toBeGreaterThanOrEqual(0);
            expect(type).toBeLessThanOrEqual(3);
            expect(r).toBeGreaterThan(0);
        }
    });
});

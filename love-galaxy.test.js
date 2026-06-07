/**
 * Tests de humo (Jest + jsdom).
 * Verifican que la capa de datos (window.db) y el módulo de juegos
 * (window.LoveGames) se registran correctamente al cargar sus scripts.
 *
 * Ejecuta los scripts clásicos en el contexto global de jsdom y comprueba
 * las APIs públicas. No requiere red ni Supabase real.
 */
const fs = require('fs');
const path = require('path');

function loadClassicScript(file) {
    const src = fs.readFileSync(path.join(__dirname, file), 'utf8');
    // window.eval ejecuta el código en el ámbito global de jsdom,
    // de modo que `window.db = ...` y `window.LoveGames = ...` quedan disponibles.
    window.eval(src);
}

describe('Love Galaxy — smoke test', () => {
    beforeAll(() => {
        loadClassicScript('db.js');
        loadClassicScript('love-games.js');
    });

    test('window.db existe y expone métodos clave', () => {
        expect(window.db).toBeDefined();
        expect(typeof window.db).toBe('object');
        expect(typeof window.db.getPhotos).toBe('function');
        expect(typeof window.db.getPlaylist).toBe('function');
        expect(typeof window.db.getTimelineEvents).toBe('function');
        expect(typeof window.db.saveGameScore).toBe('function');
    });

    test('window.LoveGames existe y expone los 7 juegos', () => {
        expect(window.LoveGames).toBeDefined();
        const keys = Object.keys(window.LoveGames);
        ['memory', 'reasons', 'roulette', 'piropos', 'compat', 'question', 'galaxy']
            .forEach((k) => expect(keys).toContain(k));
    });

    test('window.LG_BUILD está definido (marca de versión del módulo de juegos)', () => {
        expect(window.LG_BUILD).toBeDefined();
    });
});

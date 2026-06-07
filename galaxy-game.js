/* ==========================================================================
   GALAXIA DEL AMOR — render + control (motor en C++ → WebAssembly).
   Para Tamara, mi diosa Freya 💛

   El motor (física, colisiones, puntuación, combos, power-ups) vive en
   galaxy.wasm (compilado de wasm/galaxy.cpp). Aquí: cargar el wasm, leerlo cada
   frame y dibujarlo en un <canvas>, entrada (táctil/ratón/teclado), UI inmersiva,
   skins, música procedural y tabla de marcadores.

   Script clásico (no módulo). Expone window.startGalaxyLoveGame() y
   window.closeGalaxyGame() (las usa el HTML).
   ========================================================================== */
(function () {
    'use strict';

    window.LG_BUILD = '15';

    var HER = 'Tamara';
    var PHRASES = [
        'Te amo, ' + HER + ' 💖', 'Eres mi universo 🌌', 'Mi diosa Freya ✨',
        'Contigo todo brilla 💫', 'Mi lugar favorito eres tú 🏠', 'Por siempre, tú y yo 💞',
        'Eres mi estrella polar ⭐', 'Late mi corazón por ti 💓', 'Mi amor infinito 🚀',
        'Eres pura magia 🪄', 'Mi sol y mis estrellas ☀️'
    ];
    // Frases de ánimo al superar hitos de puntuación.
    var MILESTONES = [
        { s: 100,  t: '¡100! Vas genial, ' + HER + ' 💕' },
        { s: 250,  t: '¡250! Imparable 🔥' },
        { s: 500,  t: '¡500! Eres una estrella ⭐' },
        { s: 1000, t: '¡1000! Mi campeona 🏆' },
        { s: 2000, t: '¡2000! Diosa de la galaxia 🌌' },
        { s: 3500, t: '¡3500! Increíble, mi amor 💫' },
        { s: 5000, t: '¡5000! Leyenda total 👑' }
    ];

    // Skins de la nave: emoji, si rota (la 🚀 mira en diagonal) y colores de estela.
    var SKINS = [
        { id: 'rocket',    emoji: '🚀', rot: true,  trail: ['#ffd36e', '#ff8ac2'] },
        { id: 'heart',     emoji: '💖', rot: false, trail: ['#ff5fae', '#ffb3d9'] },
        { id: 'butterfly', emoji: '🦋', rot: false, trail: ['#7ec8ff', '#b69bff'] },
        { id: 'star',      emoji: '🌟', rot: false, trail: ['#ffe16a', '#fff3b0'] },
        { id: 'ufo',       emoji: '🛸', rot: false, trail: ['#7CFFB2', '#5ad1ff'] },
        { id: 'dragon',    emoji: '🐉', rot: false, trail: ['#9dff7c', '#ffd36e'] }
    ];

    // Resolver la URL del wasm con la MISMA versión que este script (cache-busting).
    var WASM_URL = (function () {
        try {
            var s = document.currentScript && document.currentScript.src;
            if (s) { var q = s.indexOf('?'); return 'galaxy.wasm' + (q >= 0 ? s.slice(q) : ''); }
        } catch (e) {}
        return 'galaxy.wasm';
    })();

    // --------------------------------------------------------------- WASM
    var instance = null, loadingPromise = null;
    function loadWasm() {
        if (instance) return Promise.resolve(instance);
        if (loadingPromise) return loadingPromise;
        loadingPromise = fetch(WASM_URL)
            .then(function (r) { if (!r.ok) throw new Error('No se pudo descargar el juego (HTTP ' + r.status + ')'); return r.arrayBuffer(); })
            .then(function (buf) { return WebAssembly.instantiate(buf, {}); })
            .then(function (res) { instance = res.instance; return instance; });
        return loadingPromise;
    }

    // --------------------------------------------------------------- estado UI
    var ex = null;
    var canvas, ctx, startEl, overEl, container, closeBtn, musicBtn, fxEl;
    var raf = 0, lastT = 0, running = false, started = false, builtUI = false;
    var dpr = 1, W = 0, H = 0;
    var stars = [], trail = [], floaters = [];
    var savedBest = 0;
    var prevScore = 0, prevCombo = 0, milestoneIdx = 0;

    // Preferencias persistentes
    var currentSkin = loadSkin();
    var musicOn = loadMusicPref();

    function loadSkin() {
        try { var id = localStorage.getItem('galaxyLoveSkin'); for (var i = 0; i < SKINS.length; i++) if (SKINS[i].id === id) return i; } catch (e) {}
        return 0;
    }
    function saveSkin() { try { localStorage.setItem('galaxyLoveSkin', SKINS[currentSkin].id); } catch (e) {} }
    function loadMusicPref() { try { return localStorage.getItem('galaxyLoveMusic') !== 'off'; } catch (e) { return true; } }
    function saveMusicPref() { try { localStorage.setItem('galaxyLoveMusic', musicOn ? 'on' : 'off'); } catch (e) {} }

    // --------------------------------------------------------------- audio
    var audioCtx = null;
    function ensureAudio() {
        if (!audioCtx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; audioCtx = new AC(); }
        if (audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
    }
    function beep(freq, dur, type, vol) {
        try {
            var ac = ensureAudio(); if (!ac) return;
            var o = ac.createOscillator(), g = ac.createGain();
            o.type = type || 'sine'; o.frequency.value = freq;
            g.gain.value = vol || 0.05;
            o.connect(g); g.connect(ac.destination);
            var t = ac.currentTime;
            g.gain.setValueAtTime(g.gain.value, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.15));
            o.start(t); o.stop(t + (dur || 0.15));
        } catch (e) {}
    }

    // --- Música procesural: progresión romántica I–V–vi–IV arpegiada ---
    var CHORDS = [
        [261.63, 329.63, 392.00, 523.25], // C
        [196.00, 246.94, 293.66, 392.00], // G
        [220.00, 261.63, 329.63, 440.00], // Am
        [174.61, 220.00, 261.63, 349.23]  // F
    ];
    var ARP = [0, 1, 2, 3, 2, 1, 2, 3];
    var STEP_DUR = 0.36; // segundos por corchea (~83 BPM)
    var music = { playing: false, timer: 0, next: 0, step: 0 };

    function musicNote(freq, t, dur, vol, type) {
        var ac = audioCtx; if (!ac) return;
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = type || 'triangle'; o.frequency.value = freq;
        o.connect(g); g.connect(ac.destination);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.start(t); o.stop(t + dur + 0.02);
    }
    function musicScheduleStep(i, t) {
        var bar = Math.floor(i / 8) % CHORDS.length, inBar = i % 8;
        var chord = CHORDS[bar];
        musicNote(chord[ARP[inBar]], t, 0.5, 0.035, 'triangle');     // melodía
        if (inBar === 0) musicNote(chord[0] / 2, t, 1.1, 0.045, 'sine'); // bajo
        if (inBar === 4) musicNote(chord[2], t, 0.5, 0.02, 'sine');      // armonía suave
    }
    function musicTick() {
        if (!music.playing || !audioCtx) return;
        while (music.next < audioCtx.currentTime + 0.12) {
            musicScheduleStep(music.step, music.next);
            music.next += STEP_DUR;
            music.step = (music.step + 1) % (CHORDS.length * 8);
        }
    }
    function musicStart() {
        if (!musicOn) return;
        if (!ensureAudio()) return;
        if (music.playing) return;
        music.playing = true; music.step = 0; music.next = audioCtx.currentTime + 0.06;
        if (music.timer) clearInterval(music.timer);
        music.timer = setInterval(musicTick, 25);
    }
    function musicStop() {
        music.playing = false;
        if (music.timer) { clearInterval(music.timer); music.timer = 0; }
    }
    function musicToggle() {
        musicOn = !musicOn; saveMusicPref();
        if (musicOn) musicStart(); else musicStop();
        if (musicBtn) musicBtn.innerHTML = musicOn ? '🎵' : '🔇';
    }

    // --------------------------------------------------------------- récord + marcadores
    function loadBest() {
        try { var ls = parseInt(localStorage.getItem('galaxyLoveBest') || '0', 10); if (!isNaN(ls)) savedBest = ls; } catch (e) {}
        if (window.db && window.db.getHighScore) {
            Promise.resolve(window.db.getHighScore('galaxyLove')).then(function (v) {
                if (typeof v === 'number' && v > savedBest) savedBest = v;
            }).catch(function () {});
        }
    }
    function saveBest(score) {
        if (score <= savedBest) return;
        savedBest = score;
        try { localStorage.setItem('galaxyLoveBest', String(score)); } catch (e) {}
    }
    function loadBoard() { try { return JSON.parse(localStorage.getItem('galaxyLoveBoard') || '[]'); } catch (e) { return []; } }
    function addToBoard(score, combo) {
        var b = loadBoard();
        b.push({ s: score, c: combo, d: Date.now() });
        b.sort(function (a, b2) { return b2.s - a.s; });
        b = b.slice(0, 10);
        try { localStorage.setItem('galaxyLoveBoard', JSON.stringify(b)); } catch (e) {}
        return b;
    }
    function persistScore(score, combo) {
        saveBest(score);
        addToBoard(score, combo);
        try { if (window.db && window.db.saveGameScore) window.db.saveGameScore('galaxyLove', score, { maxCombo: combo }); } catch (e) {}
        try { if (score > 0 && window.achievements && window.achievements.unlock) window.achievements.unlock('galaxy_explorer'); } catch (e) {}
    }
    function boardHTML() {
        var b = loadBoard();
        if (!b.length) return '<p class="gg-muted">Aún no hay marcadores. ¡Sé la primera, ' + HER + '! 🚀</p>';
        var medals = ['🥇', '🥈', '🥉'];
        var rows = b.map(function (e, i) {
            var d = new Date(e.d), fecha = d.toLocaleDateString();
            var rank = medals[i] || (i + 1);
            return '<li class="' + (i === 0 ? 'top' : '') + '"><span class="rank">' + rank + '</span>' +
                '<span>💖 ' + e.s + (e.c ? ' <span class="gg-muted">·🔥' + e.c + '</span>' : '') + '</span>' +
                '<span class="gg-muted">' + fecha + '</span></li>';
        }).join('');
        return '<ul class="gg-board">' + rows + '</ul>';
    }

    // --------------------------------------------------------------- UI (DOM)
    function injectImmersiveCSS() {
        if (document.getElementById('gg-immersive-style')) return;
        var st = document.createElement('style');
        st.id = 'gg-immersive-style';
        st.textContent =
            '#galaxy-game-modal.gg-on .modal-close,' +
            '#galaxy-game-modal.gg-on > .modal-content > h2,' +
            '#galaxy-game-modal.gg-on .galaxy-instructions{display:none !important}' +
            '#galaxy-game-modal.gg-on .galaxy-modal-content,' +
            '#galaxy-game-modal.gg-on .galaxy-game-container{padding:0 !important;border:none !important;' +
            'box-shadow:none !important;border-radius:0 !important;background:#05010d !important}' +
            '#galaxy-game-modal.gg-on .galaxy-modal-content::before{display:none !important}' +
            '.gg-pill{position:absolute;top:calc(env(safe-area-inset-top,0px) + 10px);padding:6px 13px;border-radius:999px;' +
            'background:rgba(18,7,30,.42);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);' +
            'border:1px solid rgba(255,150,200,.22);box-shadow:0 2px 14px rgba(0,0,0,.4),inset 0 0 14px rgba(255,120,190,.07);' +
            'color:#fff;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,.6);font-size:clamp(13px,3.6vw,18px);' +
            'display:flex;align-items:center;gap:.45rem;pointer-events:none;z-index:4;line-height:1;white-space:nowrap}' +
            '#gg-fx{top:calc(env(safe-area-inset-top,0px) + 52px);left:10px;font-size:clamp(12px,3.2vw,15px);gap:.7rem}' +
            '.gg-iconbtn{position:absolute;top:calc(env(safe-area-inset-top,0px) + 8px);width:42px;height:42px;border-radius:50%;' +
            'background:rgba(18,7,30,.5);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);' +
            'border:1px solid rgba(255,150,200,.35);color:#ffd3e6;font-size:20px;display:flex;align-items:center;' +
            'justify-content:center;cursor:pointer;pointer-events:auto;z-index:6;box-shadow:0 2px 14px rgba(0,0,0,.45);' +
            'transition:transform .15s ease,background .15s ease,box-shadow .15s ease}' +
            '.gg-iconbtn:hover{background:rgba(255,60,140,.55);box-shadow:0 0 18px rgba(255,80,160,.6);transform:scale(1.06)}' +
            '.gg-iconbtn:active{transform:scale(.92)}#gg-close{right:10px}#gg-music{right:60px}' +
            '.gg-skins{display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;margin:.2rem 0 1rem}' +
            '.gg-skin{font-size:1.7rem;width:54px;height:54px;border-radius:14px;background:rgba(255,255,255,.06);' +
            'border:2px solid rgba(255,150,200,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;' +
            'transition:transform .15s,border-color .15s,background .15s}' +
            '.gg-skin:hover{transform:translateY(-2px)}' +
            '.gg-skin.sel{border-color:#ff5fae;background:rgba(255,95,174,.18);box-shadow:0 0 16px rgba(255,95,174,.5)}' +
            '.gg-board{list-style:none;padding:0;margin:.5rem auto;max-width:22rem;width:100%}' +
            '.gg-board li{display:flex;justify-content:space-between;gap:1rem;padding:.4rem .8rem;border-radius:10px;' +
            'background:rgba(255,255,255,.05);margin:.25rem 0;font-size:.95rem;align-items:center}' +
            '.gg-board li.top{background:linear-gradient(90deg,rgba(255,95,174,.25),rgba(255,170,90,.15));font-weight:700}' +
            '.gg-board .rank{opacity:.85;width:1.7rem;text-align:center}.gg-muted{opacity:.6;font-size:.9em}';
        document.head.appendChild(st);
    }

    function overlay() {
        var d = document.createElement('div');
        d.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
            'text-align:center;color:#fff;padding:1.2rem;overflow:auto;' +
            'background:radial-gradient(circle at 50% 35%,rgba(40,12,55,.78),rgba(8,3,16,.94));' +
            '-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);font-family:inherit;z-index:5;';
        return d;
    }

    function buildUI() {
        if (builtUI) return;
        injectImmersiveCSS();
        container = document.getElementById('galaxy-game-container');
        if (!container) return;
        container.innerHTML = '';
        container.style.position = 'relative';
        container.style.touchAction = 'none';
        container.style.overflow = 'hidden';

        canvas = document.createElement('canvas');
        canvas.style.cssText = 'display:block;width:100%;height:100%;cursor:none;';
        container.appendChild(canvas);
        ctx = canvas.getContext('2d');

        var stats = document.createElement('div');
        stats.className = 'gg-pill'; stats.style.left = '10px';
        stats.innerHTML = '<span>💖&nbsp;<b id="gg-score">0</b></span><span style="opacity:.4">·</span>' +
            '<span style="font-size:.82em;opacity:.92">🏆&nbsp;<span id="gg-best">0</span></span>';
        container.appendChild(stats);

        var livesPill = document.createElement('div');
        livesPill.className = 'gg-pill'; livesPill.style.left = '50%'; livesPill.style.transform = 'translateX(-50%)';
        livesPill.innerHTML = '<span id="gg-lives">❤️❤️❤️</span>';
        container.appendChild(livesPill);

        fxEl = document.createElement('div');
        fxEl.className = 'gg-pill'; fxEl.id = 'gg-fx'; fxEl.style.display = 'none';
        container.appendChild(fxEl);

        musicBtn = document.createElement('button');
        musicBtn.className = 'gg-iconbtn'; musicBtn.id = 'gg-music'; musicBtn.type = 'button';
        musicBtn.setAttribute('aria-label', 'Música'); musicBtn.innerHTML = musicOn ? '🎵' : '🔇';
        musicBtn.addEventListener('click', musicToggle);
        container.appendChild(musicBtn);

        closeBtn = document.createElement('button');
        closeBtn.className = 'gg-iconbtn'; closeBtn.id = 'gg-close'; closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Cerrar juego'); closeBtn.innerHTML = '✕';
        closeBtn.addEventListener('click', closeGalaxyGame);
        container.appendChild(closeBtn);

        startEl = overlay(); container.appendChild(startEl);
        overEl = overlay(); overEl.style.display = 'none'; container.appendChild(overEl);

        canvas.addEventListener('pointermove', onPointer);
        canvas.addEventListener('touchmove', onTouch, { passive: false });
        builtUI = true;
    }

    function skinsHTML() {
        return '<div class="gg-skins">' + SKINS.map(function (s, i) {
            return '<div class="gg-skin' + (i === currentSkin ? ' sel' : '') + '" data-skin="' + i + '" title="' + s.id + '">' + s.emoji + '</div>';
        }).join('') + '</div>';
    }
    function wireSkins(root) {
        root.querySelectorAll('.gg-skin').forEach(function (el) {
            el.addEventListener('click', function () {
                currentSkin = parseInt(el.getAttribute('data-skin'), 10) || 0;
                saveSkin();
                root.querySelectorAll('.gg-skin').forEach(function (n) { n.classList.remove('sel'); });
                el.classList.add('sel');
                beep(720, 0.08, 'sine', 0.05);
            });
        });
    }

    function showStart() {
        startEl.innerHTML =
            '<div style="font-size:clamp(30px,11vw,64px);line-height:1">🌌</div>' +
            '<h2 style="margin:.3rem 0;font-family:var(--font-elegant,\'Playfair Display\',serif);color:#ffd3e6">Galaxia del Amor</h2>' +
            '<p style="max-width:30rem;margin:.2rem auto .6rem;opacity:.92;line-height:1.5">' +
            'Captura 💖 💌 ⭐ y recoge power-ups: ⚡ boost x2 · 🧲 imán · 🛡️ escudo · 💗 vida. ¡Esquiva ☄️!</p>' +
            '<p style="opacity:.8;font-size:.9em;margin:.1rem 0 .4rem">Elige tu nave:</p>' +
            skinsHTML() +
            '<div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center">' +
            '<button id="gg-play" class="btn btn-primary" style="font-size:1.05rem;padding:.75rem 1.8rem;border-radius:999px">🚀 Despegar</button>' +
            '<button id="gg-board-btn" class="btn" style="font-size:1rem;padding:.75rem 1.4rem;border-radius:999px;background:rgba(255,255,255,.12);color:#fff">🏆 Marcadores</button>' +
            '</div>' +
            '<p style="opacity:.7;font-size:.84em;margin-top:1rem">Móvil: desliza el dedo · PC: ratón o ↑↓ · P: pausa</p>';
        startEl.style.display = 'flex';
        wireSkins(startEl);
        startEl.querySelector('#gg-play').addEventListener('click', beginPlay);
        startEl.querySelector('#gg-board-btn').addEventListener('click', showBoard);
    }

    function showBoard() {
        overEl.innerHTML =
            '<h2 style="margin:.2rem 0;font-family:var(--font-elegant,\'Playfair Display\',serif);color:#ffd3e6">🏆 Marcadores</h2>' +
            boardHTML() +
            '<button id="gg-back" class="btn btn-primary" style="margin-top:.8rem;padding:.7rem 1.8rem;border-radius:999px">⟵ Volver</button>';
        overEl.style.display = 'flex';
        overEl.querySelector('#gg-back').addEventListener('click', function () { overEl.style.display = 'none'; showStart(); });
    }

    function onPointer(e) { if (!ex) return; var r = canvas.getBoundingClientRect(); ex.setPointer((e.clientY - r.top) * dpr); }
    function onTouch(e) {
        if (!ex || !e.touches.length) return;
        e.preventDefault();
        var r = canvas.getBoundingClientRect();
        ex.setPointer((e.touches[0].clientY - r.top) * dpr);
    }
    function onKey(e) {
        if (!ex || !running) return;
        var step = H * 0.08;
        if (e.key === 'ArrowUp') { ex.setPointer(Math.max(0, ex.playerYf() - step)); e.preventDefault(); }
        else if (e.key === 'ArrowDown') { ex.setPointer(Math.min(H, ex.playerYf() + step)); e.preventDefault(); }
        else if (e.key === 'p' || e.key === 'P') { running = !running; if (running) { lastT = performance.now(); loop(lastT); } }
    }

    function fit() {
        if (!container || !canvas) return;
        var rect = container.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = Math.max(2, Math.round(rect.width * dpr));
        H = Math.max(2, Math.round(rect.height * dpr));
        canvas.width = W; canvas.height = H;
        if (ex) ex.resize(W, H);
        makeStars();
    }
    function makeStars() {
        stars = [];
        var n = Math.round((W * H) / 16000); if (n > 220) n = 220;
        for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, z: 0.3 + Math.random() * 1.7, s: Math.random() * 1.6 + 0.4, tw: Math.random() * 6.28 });
    }

    // --------------------------------------------------------------- flujo
    function beginPlay() {
        if (!ex) return;
        startEl.style.display = 'none'; overEl.style.display = 'none';
        trail = []; floaters = [];
        prevScore = 0; prevCombo = 0; milestoneIdx = 0;
        ex.start((Date.now() & 0x7fffffff) >>> 0);
        started = true; running = true;
        musicStart();
        beep(660, 0.18, 'triangle', 0.06);
        lastT = performance.now();
        cancelAnimationFrame(raf);
        loop(lastT);
    }

    function gameOver() {
        running = false;
        var score = ex.getScore(), combo = ex.getMaxCombo();
        persistScore(score, combo);
        var best = Math.max(savedBest, ex.getBest());
        beep(180, 0.5, 'sawtooth', 0.05);
        overEl.innerHTML =
            '<div style="font-size:clamp(28px,9vw,56px)">💫</div>' +
            '<h2 style="margin:.2rem 0;font-family:var(--font-elegant,\'Playfair Display\',serif);color:#ffd3e6">Fin del viaje</h2>' +
            '<p style="font-size:clamp(20px,6vw,30px);margin:.1rem 0"><b>💖 ' + score + '</b></p>' +
            '<p style="opacity:.9;margin:.1rem 0">🏆 Récord: ' + best + ' · 🔥 Combo máx: ' + combo + '</p>' +
            '<p style="max-width:26rem;opacity:.85;margin:.5rem auto .4rem">' + PHRASES[Math.floor(Math.random() * PHRASES.length)] + '</p>' +
            boardHTML() +
            '<div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;margin-top:.6rem">' +
            '<button id="gg-again" class="btn btn-primary" style="padding:.75rem 1.8rem;border-radius:999px">💞 Volver a jugar</button>' +
            '<button id="gg-menu" class="btn" style="padding:.75rem 1.4rem;border-radius:999px;background:rgba(255,255,255,.12);color:#fff">🏠 Menú</button>' +
            '</div>';
        overEl.style.display = 'flex';
        overEl.querySelector('#gg-again').addEventListener('click', beginPlay);
        overEl.querySelector('#gg-menu').addEventListener('click', function () { overEl.style.display = 'none'; showStart(); });
    }

    // --------------------------------------------------------------- bucle
    var POWER_FX = {
        1: { t: '🛡️ ¡Escudo!', f: 520 }, 2: { t: '⚡ ¡Boost x2!', f: 980 },
        3: { t: '🧲 ¡Imán!', f: 700 }, 4: { t: '⭐ +50', f: 1180 }, 5: { t: '💗 ¡Vida extra!', f: 860 }
    };
    function loop(now) {
        if (!running) return;
        var dt = (now - lastT) / 1000; lastT = now;
        if (dt < 0) dt = 0;
        var st = ex.update(dt);

        // eventos: power-ups, mensajes, puntos, golpes
        var pw = ex.evtPower();
        if (pw && POWER_FX[pw]) { pushFloater(POWER_FX[pw].t, 1); beep(POWER_FX[pw].f, 0.18, 'sine', 0.06); }
        if (ex.evtMsg()) { pushFloater(PHRASES[Math.floor(Math.random() * PHRASES.length)], 1); beep(880, 0.2, 'sine', 0.06); }
        else if (ex.evtPickup() && !pw) { pushFloater('+10', 0); beep(760, 0.1, 'sine', 0.05); }
        if (ex.evtHit()) beep(140, 0.25, 'square', 0.07);

        // personalidad: hitos de puntuación y de combo
        var sc = ex.getScore();
        while (milestoneIdx < MILESTONES.length && sc >= MILESTONES[milestoneIdx].s) {
            pushFloater(MILESTONES[milestoneIdx].t, 1); beep(1040, 0.22, 'triangle', 0.05); milestoneIdx++;
        }
        var cb = ex.getCombo();
        if (cb >= 5 && cb % 5 === 0 && cb !== prevCombo) { pushFloater('¡Combo x' + cb + '! 🔥', 1); beep(600 + cb * 8, 0.12, 'square', 0.04); }
        prevCombo = cb; prevScore = sc;

        draw(dt);
        updateHud();

        if (st === 2) { gameOver(); return; }
        raf = requestAnimationFrame(loop);
    }

    function pushFloater(text, big) { floaters.push({ t: text, x: ex.playerXf(), y: ex.playerYf() - ex.playerRf(), a: 1, big: big }); }

    function chip(emoji, pct) {
        var w = Math.max(0, Math.min(1, pct));
        return '<span style="display:inline-flex;align-items:center;gap:3px">' + emoji +
            '<span style="display:inline-block;width:22px;height:4px;border-radius:2px;background:rgba(255,255,255,.2);overflow:hidden">' +
            '<span style="display:block;height:100%;width:' + (w * 100) + '%;background:#ffd36e"></span></span></span>';
    }
    function updateHud() {
        var s = document.getElementById('gg-score'); if (s) s.textContent = ex.getScore();
        var b = document.getElementById('gg-best'); if (b) b.textContent = Math.max(savedBest, ex.getBest());
        var lv = document.getElementById('gg-lives');
        if (lv) { var n = ex.getLives(); var c = ex.getCombo(); lv.textContent = '❤️'.repeat(n) + '🖤'.repeat(Math.max(0, 5 - n)) + (c >= 3 ? '  🔥' + c : ''); }
        if (fxEl) {
            var f = '';
            if (ex.getBoost())  f += chip('⚡', ex.boostPct());
            if (ex.getMagnet()) f += chip('🧲', ex.magnetPct());
            if (ex.getShield()) f += chip('🛡️', ex.shieldPct());
            fxEl.innerHTML = f; fxEl.style.display = f ? 'flex' : 'none';
        }
    }

    // --------------------------------------------------------------- dibujo
    var EMO = ['💖', '💌', '☄️', '🛡️', '⚡', '🧲', '⭐', '💗'];
    var GLOW = ['rgba(255,120,190,.7)', 'rgba(255,120,190,.7)', 'rgba(255,150,90,.6)', 'rgba(120,200,255,.7)',
                'rgba(255,225,90,.8)', 'rgba(120,180,255,.8)', 'rgba(255,225,90,.85)', 'rgba(255,120,190,.8)'];
    var bgT = 0;
    function draw(dt) {
        bgT += dt;
        var g = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, Math.max(W, H) * 0.9);
        g.addColorStop(0, '#1d0d33'); g.addColorStop(0.55, '#100820'); g.addColorStop(1, '#05010d');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

        ctx.globalCompositeOperation = 'lighter';
        nebula(W * (0.30 + 0.05 * Math.sin(bgT * 0.07)), H * (0.30 + 0.04 * Math.cos(bgT * 0.05)), Math.max(W, H) * 0.45, 'rgba(150,40,160,0.16)');
        nebula(W * (0.74 + 0.05 * Math.cos(bgT * 0.06)), H * (0.66 + 0.05 * Math.sin(bgT * 0.04)), Math.max(W, H) * 0.5, 'rgba(40,70,180,0.14)');
        ctx.globalCompositeOperation = 'source-over';

        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.x -= s.z * 60 * dt * dpr; s.tw += dt * 3;
            if (s.x < 0) { s.x = W; s.y = Math.random() * H; }
            ctx.globalAlpha = 0.4 + 0.4 * Math.sin(s.tw);
            ctx.fillStyle = '#fff'; ctx.fillRect(s.x, s.y, s.s * dpr, s.s * dpr);
        }
        ctx.globalAlpha = 1;
        if (!ex) return;

        var ptr = ex.renderPtr(), cnt = ex.renderCount(), fp = ex.floatsPer();
        var mem = new Float32Array(instance.exports.memory.buffer, ptr, cnt * fp);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (var k = 0; k < cnt; k++) {
            var type = mem[k * fp] | 0, x = mem[k * fp + 1], y = mem[k * fp + 2], r = mem[k * fp + 3], ph = mem[k * fp + 4];
            ctx.save(); ctx.translate(x, y);
            if (type === 2) ctx.rotate(ph);
            ctx.font = (r * 2.3) + 'px serif';
            ctx.shadowColor = GLOW[type] || 'rgba(255,255,255,.6)'; ctx.shadowBlur = r * 0.8;
            ctx.fillText(EMO[type] || '✨', 0, 0);
            ctx.restore();
        }
        ctx.shadowBlur = 0;

        // nave + estela + escudo (según skin)
        var sk = SKINS[currentSkin] || SKINS[0];
        var px = ex.playerXf(), py = ex.playerYf(), pr = ex.playerRf();
        trail.push({ x: px, y: py });
        if (trail.length > 16) trail.shift();
        for (var t = 0; t < trail.length; t++) {
            var tp = trail[t], al = t / trail.length;
            ctx.globalAlpha = al * (ex.getBoost() ? 0.75 : 0.5);
            ctx.fillStyle = t % 2 ? sk.trail[0] : sk.trail[1];
            ctx.beginPath(); ctx.arc(tp.x - pr * 0.7, tp.y, pr * (ex.getBoost() ? 0.38 : 0.28) * al, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;

        if (ex.getShield()) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(120,200,255,' + (0.5 + 0.4 * Math.sin(performance.now() / 120)) + ')';
            ctx.lineWidth = Math.max(2, pr * 0.16);
            ctx.arc(px, py, pr * 1.4, 0, 6.2832); ctx.stroke();
        }
        if (ex.getMagnet()) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(150,180,255,' + (0.35 + 0.3 * Math.sin(performance.now() / 90)) + ')';
            ctx.lineWidth = Math.max(1.5, pr * 0.1);
            ctx.arc(px, py, pr * 1.9, 0, 6.2832); ctx.stroke();
        }
        ctx.save(); ctx.translate(px, py);
        ctx.font = (pr * 2.4) + 'px serif';
        ctx.shadowColor = ex.getBoost() ? 'rgba(255,225,90,.95)' : 'rgba(255,170,90,.9)';
        ctx.shadowBlur = pr * (ex.getBoost() ? 1.3 : 0.9);
        if (sk.rot) ctx.rotate(0.785398);
        ctx.fillText(sk.emoji, 0, 0);
        ctx.restore(); ctx.shadowBlur = 0;

        for (var fI = floaters.length - 1; fI >= 0; fI--) {
            var fl = floaters[fI];
            fl.y -= 28 * dt * dpr; fl.a -= dt * (fl.big ? 0.7 : 1.4);
            if (fl.a <= 0) { floaters.splice(fI, 1); continue; }
            ctx.globalAlpha = Math.max(0, fl.a);
            ctx.fillStyle = fl.big ? '#ffd3e6' : '#ffe6a0';
            ctx.font = (fl.big ? Math.max(15, pr * 0.95) : Math.max(12, pr * 0.8)) + 'px ' + (fl.big ? 'sans-serif' : 'serif');
            ctx.fillText(fl.t, fl.x, fl.y);
        }
        ctx.globalAlpha = 1;

        var vg = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.34, W * 0.5, H * 0.5, Math.max(W, H) * 0.72);
        vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    }
    function nebula(x, y, r, color) {
        var ng = ctx.createRadialGradient(x, y, 0, x, y, r);
        ng.addColorStop(0, color); ng.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H);
    }
    function drawIdle() { if (!ctx) return; if (ex) ex.update(0); draw(0.016); }

    // --------------------------------------------------------------- API pública
    function startGalaxyLoveGame() {
        var modal = document.getElementById('galaxy-game-modal');
        if (!modal) return;
        modal.classList.add('active', 'full-screen', 'gg-on');
        loadBest();
        buildUI();
        loadWasm().then(function (inst) {
            ex = inst.exports;
            void modal.offsetWidth;
            fit();
            ex.init((Date.now() & 0x7fffffff) >>> 0, W, H);
            started = false; running = false;
            showStart();
            drawIdle();
        }).catch(function (err) {
            if (window.__lgShowErr) window.__lgShowErr('Galaxia: ' + (err && err.message ? err.message : err));
            if (container) container.innerHTML = '<div style="color:#fff;text-align:center;padding:2rem">No se pudo cargar el juego 😢<br><small style="opacity:.7">' +
                (err && err.message ? err.message : err) + '</small></div>';
        });
    }

    function closeGalaxyGame() {
        running = false;
        cancelAnimationFrame(raf);
        musicStop();
        var modal = document.getElementById('galaxy-game-modal');
        if (modal) modal.classList.remove('active', 'full-screen', 'gg-on');
    }

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) { running = false; musicStop(); }
        else if (started && ex && ex.getState() === 1 && !running) { running = true; musicStart(); lastT = performance.now(); loop(lastT); }
    });
    window.addEventListener('resize', function () {
        var m = document.getElementById('galaxy-game-modal');
        if (m && m.classList.contains('active')) fit();
    });
    window.addEventListener('keydown', onKey);

    function wireButtons() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest && e.target.closest('[data-game="galaxy"]');
            if (btn) { e.preventDefault(); startGalaxyLoveGame(); }
        }, true);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireButtons);
    else wireButtons();

    window.startGalaxyLoveGame = startGalaxyLoveGame;
    window.closeGalaxyGame = closeGalaxyGame;
    window.GalaxyGame = { start: startGalaxyLoveGame, close: closeGalaxyGame, loadWasm: loadWasm };
})();

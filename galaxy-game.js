/* ==========================================================================
   GALAXIA DEL AMOR — render + control (motor en C++ → WebAssembly).
   Para Tamara, mi diosa Freya 💛

   El motor (física, colisiones, puntuación) vive en galaxy.wasm (compilado de
   wasm/galaxy.cpp). Aquí solo: cargar el wasm, leer su estado cada frame y
   dibujarlo en un <canvas>, además de la entrada (táctil/ratón/teclado) y la UI.

   Script clásico (no módulo). Expone window.startGalaxyLoveGame() y
   window.closeGalaxyGame() (las usa el HTML).
   ========================================================================== */
(function () {
    'use strict';

    // Marca de versión para el badge de diagnóstico.
    window.LG_BUILD = '11';

    var HER = 'Tamara', NICK = 'mi diosa Freya';
    var PHRASES = [
        'Te amo, ' + HER + ' 💖',
        'Eres mi universo 🌌',
        'Mi diosa Freya ✨',
        'Contigo todo brilla 💫',
        'Mi lugar favorito eres tú 🏠',
        'Por siempre, tú y yo 💞',
        'Eres mi estrella polar ⭐',
        'Late mi corazón por ti 💓'
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
    var ex = null;                 // exports del wasm
    var canvas, ctx, startEl, overEl, container, closeBtn;
    var raf = 0, lastT = 0, running = false, started = false, builtUI = false;
    var dpr = 1, W = 0, H = 0;
    var stars = [], trail = [], floaters = [];
    var savedBest = 0;
    var audioCtx = null;

    // --------------------------------------------------------------- sonido
    function beep(freq, dur, type, vol) {
        try {
            if (!audioCtx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; audioCtx = new AC(); }
            if (audioCtx.state === 'suspended') audioCtx.resume();
            var o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = type || 'sine'; o.frequency.value = freq;
            g.gain.value = vol || 0.05;
            o.connect(g); g.connect(audioCtx.destination);
            var t = audioCtx.currentTime;
            g.gain.setValueAtTime(g.gain.value, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.15));
            o.start(t); o.stop(t + (dur || 0.15));
        } catch (e) {}
    }

    // --------------------------------------------------------------- récord
    function loadBest() {
        try {
            var ls = parseInt(localStorage.getItem('galaxyLoveBest') || '0', 10);
            if (!isNaN(ls)) savedBest = ls;
        } catch (e) {}
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
        try { if (window.db && window.db.saveGameScore) window.db.saveGameScore('galaxyLove', score); } catch (e) {}
        try { if (window.achievements && window.achievements.unlock) window.achievements.unlock('galaxy_explorer'); } catch (e) {}
    }

    // --------------------------------------------------------------- UI (DOM)
    // Inyecta (una vez) los estilos que hacen el juego inmersivo: oculta el cromo
    // del modal (× rosa, título e instrucciones) y deja el lienzo a sangre.
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
            '#gg-close{position:absolute;top:calc(env(safe-area-inset-top,0px) + 8px);right:10px;width:42px;height:42px;' +
            'border-radius:50%;background:rgba(18,7,30,.5);-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);' +
            'border:1px solid rgba(255,150,200,.35);color:#ffd3e6;font-size:20px;display:flex;align-items:center;' +
            'justify-content:center;cursor:pointer;pointer-events:auto;z-index:6;box-shadow:0 2px 14px rgba(0,0,0,.45);' +
            'transition:transform .15s ease,background .15s ease,box-shadow .15s ease}' +
            '#gg-close:hover{background:rgba(255,60,140,.55);box-shadow:0 0 18px rgba(255,80,160,.6);transform:scale(1.06)}' +
            '#gg-close:active{transform:scale(.92)}';
        document.head.appendChild(st);
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

        // HUD en píldoras de cristal: izquierda (puntos+récord), centro (vidas/escudo).
        var stats = document.createElement('div');
        stats.className = 'gg-pill';
        stats.style.left = '10px';
        stats.innerHTML = '<span>💖&nbsp;<b id="gg-score">0</b></span>' +
            '<span style="opacity:.4">·</span>' +
            '<span style="font-size:.82em;opacity:.92">🏆&nbsp;<span id="gg-best">0</span></span>';
        container.appendChild(stats);

        var livesPill = document.createElement('div');
        livesPill.className = 'gg-pill';
        livesPill.style.left = '50%';
        livesPill.style.transform = 'translateX(-50%)';
        livesPill.innerHTML = '<span id="gg-lives">❤️❤️❤️</span>';
        container.appendChild(livesPill);

        closeBtn = document.createElement('button');
        closeBtn.id = 'gg-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Cerrar juego');
        closeBtn.innerHTML = '✕';
        closeBtn.addEventListener('click', closeGalaxyGame);
        container.appendChild(closeBtn);

        startEl = overlay();
        startEl.innerHTML =
            '<div style="font-size:clamp(34px,12vw,72px);line-height:1">🌌</div>' +
            '<h2 style="margin:.4rem 0;font-family:var(--font-elegant,\'Playfair Display\',serif);color:#ffd3e6">Galaxia del Amor</h2>' +
            '<p style="max-width:30rem;margin:.3rem auto 1rem;opacity:.92;line-height:1.5">' +
            'Pilota la nave 🚀 y captura <b>corazones</b> 💖 y <b>mensajes</b> 💌 esquivando los <b>asteroides</b> ☄️. ' +
            'Recoge el <b>escudo</b> 🛡️ para protegerte.</p>' +
            '<p style="opacity:.8;font-size:.92em;margin-bottom:1.2rem">Móvil: <b>desliza el dedo</b> arriba/abajo · PC: <b>mueve el ratón</b> o <b>↑ ↓</b></p>' +
            '<button id="gg-play" class="btn btn-primary" style="font-size:1.05rem;padding:.8rem 2rem;border-radius:999px">🚀 Despegar</button>';
        container.appendChild(startEl);

        overEl = overlay();
        overEl.style.display = 'none';
        container.appendChild(overEl);

        canvas.addEventListener('pointermove', onPointer);
        canvas.addEventListener('touchmove', onTouch, { passive: false });
        startEl.querySelector('#gg-play').addEventListener('click', beginPlay);

        builtUI = true;
    }

    function overlay() {
        var d = document.createElement('div');
        d.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;' +
            'color:#fff;padding:1.2rem;background:radial-gradient(circle at 50% 35%,rgba(40,12,55,.72),rgba(10,4,20,.92));' +
            'backdrop-filter:blur(3px);font-family:inherit;z-index:5;';
        return d;
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
        var n = Math.round((W * H) / 16000);
        if (n > 220) n = 220;
        for (var i = 0; i < n; i++) {
            stars.push({ x: Math.random() * W, y: Math.random() * H, z: 0.3 + Math.random() * 1.7, s: Math.random() * 1.6 + 0.4, tw: Math.random() * 6.28 });
        }
    }

    // --------------------------------------------------------------- flujo
    function beginPlay() {
        if (!ex) return;
        startEl.style.display = 'none';
        overEl.style.display = 'none';
        trail = []; floaters = [];
        ex.start((Date.now() & 0x7fffffff) >>> 0);
        started = true; running = true;
        beep(660, 0.18, 'triangle', 0.06);
        lastT = performance.now();
        cancelAnimationFrame(raf);
        loop(lastT);
    }

    function gameOver() {
        running = false;
        var score = ex.getScore();
        saveBest(score);
        var best = Math.max(savedBest, ex.getBest());
        beep(180, 0.5, 'sawtooth', 0.05);
        overEl.innerHTML =
            '<div style="font-size:clamp(30px,10vw,60px)">💫</div>' +
            '<h2 style="margin:.3rem 0;font-family:var(--font-elegant,\'Playfair Display\',serif);color:#ffd3e6">Fin del viaje</h2>' +
            '<p style="font-size:clamp(20px,6vw,30px);margin:.2rem 0"><b>💖 ' + score + '</b></p>' +
            '<p style="opacity:.9;margin-bottom:1rem">🏆 Récord: ' + best + '</p>' +
            '<p style="max-width:28rem;opacity:.85;margin-bottom:1.1rem">' + PHRASES[Math.floor(Math.random() * PHRASES.length)] + '</p>' +
            '<button id="gg-again" class="btn btn-primary" style="font-size:1.05rem;padding:.8rem 2rem;border-radius:999px">💞 Volver a jugar</button>';
        overEl.style.display = 'flex';
        overEl.querySelector('#gg-again').addEventListener('click', beginPlay);
    }

    // --------------------------------------------------------------- bucle
    function loop(now) {
        if (!running) return;
        var dt = (now - lastT) / 1000; lastT = now;
        if (dt < 0) dt = 0;
        var st = ex.update(dt);

        // eventos -> sonido + frases flotantes
        if (ex.evtPickup()) {
            if (ex.evtMsg()) { floaters.push({ t: PHRASES[Math.floor(Math.random() * PHRASES.length)], x: ex.playerXf(), y: ex.playerYf(), a: 1, big: 1 }); beep(880, 0.2, 'sine', 0.06); }
            else { floaters.push({ t: '+10', x: ex.playerXf(), y: ex.playerYf(), a: 1, big: 0 }); beep(760, 0.1, 'sine', 0.05); }
        }
        if (ex.evtHit()) beep(140, 0.25, 'square', 0.07);

        draw(dt);
        updateHud();

        if (st === 2) { gameOver(); return; }
        raf = requestAnimationFrame(loop);
    }

    function updateHud() {
        var sc = document.getElementById('gg-score'); if (sc) sc.textContent = ex.getScore();
        var be = document.getElementById('gg-best'); if (be) be.textContent = Math.max(savedBest, ex.getBest());
        var lv = document.getElementById('gg-lives');
        if (lv) {
            if (ex.getShield()) { lv.textContent = '🛡️ ' + Math.ceil(ex.shieldPct() * 6) + 's'; }
            else { var lives = ex.getLives(); lv.textContent = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives)); }
        }
    }

    // --------------------------------------------------------------- dibujo
    var EMO = ['💖', '💌', '☄️', '🛡️'];
    var bgT = 0;
    function draw(dt) {
        bgT += dt;
        // fondo profundo
        var g = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, Math.max(W, H) * 0.9);
        g.addColorStop(0, '#1d0d33'); g.addColorStop(0.55, '#100820'); g.addColorStop(1, '#05010d');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

        // nebulosas suaves que derivan (profundidad/inmersión)
        ctx.globalCompositeOperation = 'lighter';
        nebula(W * (0.30 + 0.05 * Math.sin(bgT * 0.07)), H * (0.30 + 0.04 * Math.cos(bgT * 0.05)), Math.max(W, H) * 0.45, 'rgba(150,40,160,0.16)');
        nebula(W * (0.74 + 0.05 * Math.cos(bgT * 0.06)), H * (0.66 + 0.05 * Math.sin(bgT * 0.04)), Math.max(W, H) * 0.5, 'rgba(40,70,180,0.14)');
        ctx.globalCompositeOperation = 'source-over';

        // estrellas (parallax)
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.x -= s.z * 60 * dt * dpr;
            s.tw += dt * 3;
            if (s.x < 0) { s.x = W; s.y = Math.random() * H; }
            ctx.globalAlpha = 0.4 + 0.4 * Math.sin(s.tw);
            ctx.fillStyle = '#fff';
            ctx.fillRect(s.x, s.y, s.s * dpr, s.s * dpr);
        }
        ctx.globalAlpha = 1;

        if (!ex) return;

        // entidades
        var ptr = ex.renderPtr(), cnt = ex.renderCount(), fp = ex.floatsPer();
        var mem = new Float32Array(instance.exports.memory.buffer, ptr, cnt * fp);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (var k = 0; k < cnt; k++) {
            var type = mem[k * fp] | 0, x = mem[k * fp + 1], y = mem[k * fp + 2], r = mem[k * fp + 3], ph = mem[k * fp + 4];
            var size = r * 2.3;
            ctx.save();
            ctx.translate(x, y);
            if (type === 2) ctx.rotate(ph); // asteroides giran
            ctx.font = size + 'px serif';
            ctx.shadowColor = type === 2 ? 'rgba(255,150,90,.6)' : 'rgba(255,120,190,.7)';
            ctx.shadowBlur = r * 0.7;
            ctx.fillText(EMO[type] || '✨', 0, 0);
            ctx.restore();
        }
        ctx.shadowBlur = 0;

        // nave + estela + escudo
        var px = ex.playerXf(), py = ex.playerYf(), pr = ex.playerRf();
        trail.push({ x: px, y: py });
        if (trail.length > 14) trail.shift();
        for (var tt = 0; tt < trail.length; tt++) {
            var tp = trail[tt], al = tt / trail.length;
            ctx.globalAlpha = al * 0.5;
            ctx.fillStyle = tt % 2 ? '#ff8ac2' : '#ffd36e';
            ctx.beginPath(); ctx.arc(tp.x - pr * 0.7, tp.y, pr * 0.28 * al, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;

        if (ex.getShield()) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(120,200,255,' + (0.5 + 0.4 * Math.sin(performance.now() / 120)) + ')';
            ctx.lineWidth = Math.max(2, pr * 0.16);
            ctx.arc(px, py, pr * 1.35, 0, 6.2832); ctx.stroke();
        }
        ctx.save();
        ctx.translate(px, py);
        ctx.font = (pr * 2.4) + 'px serif';
        ctx.shadowColor = 'rgba(255,170,90,.9)'; ctx.shadowBlur = pr * 0.9;
        ctx.rotate(0.785398); // 🚀 apunta arriba-derecha; girar para que mire a la derecha
        ctx.fillText('🚀', 0, 0);
        ctx.restore();
        ctx.shadowBlur = 0;

        // frases flotantes
        for (var fI = floaters.length - 1; fI >= 0; fI--) {
            var fl = floaters[fI];
            fl.y -= 26 * dt * dpr; fl.a -= dt * (fl.big ? 0.7 : 1.4);
            if (fl.a <= 0) { floaters.splice(fI, 1); continue; }
            ctx.globalAlpha = Math.max(0, fl.a);
            ctx.fillStyle = fl.big ? '#ffd3e6' : '#ffe6a0';
            ctx.font = (fl.big ? Math.max(14, pr * 0.9) : Math.max(12, pr * 0.8)) + 'px ' + (fl.big ? 'sans-serif' : 'serif');
            ctx.fillText(fl.t, fl.x, fl.y);
        }
        ctx.globalAlpha = 1;

        // viñeta: oscurece los bordes para dar foco y profundidad
        var vg = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.34, W * 0.5, H * 0.5, Math.max(W, H) * 0.72);
        vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    }

    function nebula(x, y, r, color) {
        var ng = ctx.createRadialGradient(x, y, 0, x, y, r);
        ng.addColorStop(0, color); ng.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ng; ctx.fillRect(0, 0, W, H);
    }

    // Pinta un frame estático mientras está la pantalla de inicio.
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
            void modal.offsetWidth; // reflow para medir el contenedor
            fit();
            ex.init((Date.now() & 0x7fffffff) >>> 0, W, H);
            started = false; running = false;
            startEl.style.display = 'flex';
            overEl.style.display = 'none';
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
        var modal = document.getElementById('galaxy-game-modal');
        if (modal) modal.classList.remove('active', 'full-screen', 'gg-on');
    }

    // Pausar si se oculta la pestaña; reanudar al volver.
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) running = false;
        else if (started && ex && ex.getState() === 1 && !running) { running = true; lastT = performance.now(); loop(lastT); }
    });
    window.addEventListener('resize', function () {
        var m = document.getElementById('galaxy-game-modal');
        if (m && m.classList.contains('active')) fit();
    });
    window.addEventListener('keydown', onKey);

    // Cableado del botón "Despegar" (robusto: delegación en captura).
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

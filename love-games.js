/* ==========================================================================
   LOVE GAMES — Juegos románticos para Tamara (mi diosa Freya) 💛
   Módulo autocontenido: crea su propio modal y estilos (prefijo lg-),
   se cablea por delegación de eventos (sin depender de onclick inline).
   ========================================================================== */
(function () {
    'use strict';

    // Marca de versión: la etiqueta de diagnóstico solo mostrará "6" si ESTE
    // archivo (el nuevo) realmente se ejecutó. Si muestra algo distinto, el
    // navegador/servidor está sirviendo una versión vieja en caché.
    window.LG_BUILD = '10';

    const HER = 'Tamara';
    const NICK = 'mi diosa Freya';

    // ----------------------------------------------------------------- estilos
    function injectStyles() {
        if (document.getElementById('lg-styles')) return;
        const s = document.createElement('style');
        s.id = 'lg-styles';
        s.textContent = `
        #lg-modal .modal-content { max-width: 560px; max-height: 90vh; overflow-y: auto; text-align: center; }
        #lg-modal .modal-close { font-size: 2.2rem; width: 44px; height: 44px; line-height: 44px; }
        .lg-title { font-family: var(--font-elegant,'Playfair Display',serif); color: var(--dark-pink,#c96f8e); margin-bottom: .25rem; }
        .lg-sub { color: var(--text-secondary,#8a7b82); margin-bottom: 1.25rem; }
        .lg-btn { display:inline-block; margin-top:1rem; padding:.8rem 1.6rem; border:none; border-radius:999px;
            background: var(--primary-color,#d98aa3); color:#fff; font-weight:600; font-size:1rem; cursor:pointer;
            box-shadow: var(--shadow-sm,0 1px 3px rgba(74,59,67,.1)); transition: all .2s; }
        .lg-btn:hover { background: var(--dark-pink,#c96f8e); transform: translateY(-1px); }
        .lg-btn:disabled { opacity:.6; cursor:default; transform:none; }
        .lg-stats { display:flex; justify-content:center; gap:1.2rem; flex-wrap:wrap; margin-bottom:1rem;
            color:var(--text-secondary,#8a7b82); font-size:.9rem; }
        .lg-stats b { color: var(--dark-pink,#c96f8e); }
        .lg-board { display:grid; grid-template-columns:repeat(4,1fr); gap:.6rem; max-width:360px; margin:0 auto; }
        .lg-card { aspect-ratio:1; perspective:600px; cursor:pointer; }
        .lg-card-in { position:relative; width:100%; height:100%; transition:transform .5s; transform-style:preserve-3d; }
        .lg-card.flip .lg-card-in { transform: rotateY(180deg); }
        .lg-card-f, .lg-card-b { position:absolute; inset:0; backface-visibility:hidden; border-radius:12px;
            display:flex; align-items:center; justify-content:center; }
        .lg-card-f { background:linear-gradient(135deg,#d98aa3,#c9b3d9); color:#fff; font-size:1.6rem; }
        .lg-card-b { background:#fff; border:1px solid var(--border-soft,#efe1e6); font-size:2rem; transform:rotateY(180deg); }
        .lg-reason, .lg-piropo { min-height:90px; display:flex; align-items:center; justify-content:center;
            font-size:1.25rem; line-height:1.5; color:var(--text-primary,#4a3b43); background:var(--surface-tint,#fdf3f5);
            border:1px solid var(--border-soft,#efe1e6); border-radius:16px; padding:1.5rem; transition:opacity .2s; }
        .lg-slot { font-size:1.6rem; min-height:80px; display:flex; align-items:center; justify-content:center;
            background:var(--surface-tint,#fdf3f5); border:2px dashed var(--primary-color,#d98aa3); border-radius:16px;
            padding:1.25rem; color:var(--dark-pink,#c96f8e); font-weight:600; }
        .lg-q { font-size:1.15rem; color:var(--text-primary,#4a3b43); margin-bottom:1rem; }
        .lg-input { width:100%; padding:.9rem 1rem; border-radius:12px; border:1px solid var(--border-soft,#efe1e6);
            background:var(--surface-tint,#fdf3f5); color:var(--text-primary,#4a3b43); font-family:inherit; font-size:1rem; resize:vertical; }
        .lg-opt { background:var(--surface-tint,#fdf3f5); border:1px solid var(--border-soft,#efe1e6); border-radius:12px;
            padding:.85rem 1rem; margin:.4rem 0; cursor:pointer; text-align:left; transition:all .15s; }
        .lg-opt:hover { border-color:var(--primary-color,#d98aa3); }
        .lg-opt.sel { background:var(--primary-color,#d98aa3); color:#fff; border-color:var(--primary-color,#d98aa3); }
        .lg-qblock { margin-bottom:1.2rem; text-align:left; }
        .lg-qblock h4 { color:var(--text-primary,#4a3b43); margin-bottom:.5rem; }
        .lg-result { margin-top:1rem; padding:1.5rem; border-radius:16px; background:var(--surface-tint,#fdf3f5); }
        .lg-pct { font-size:3.5rem; font-weight:800; color:var(--dark-pink,#c96f8e); }
        .lg-prev { text-align:left; margin-top:1.25rem; }
        .lg-prev .it { background:var(--surface-tint,#fdf3f5); border:1px solid var(--border-soft,#efe1e6);
            border-radius:12px; padding:.7rem .9rem; margin-bottom:.5rem; }
        .lg-prev .it b { color:var(--dark-pink,#c96f8e); display:block; font-size:.8rem; margin-bottom:.2rem; }
        `;
        document.head.appendChild(s);
    }

    // ------------------------------------------------------------------ modal
    let modalEl, bodyEl;
    let timers = [];
    function track(id) { timers.push(id); return id; }
    function stopTimers() { timers.forEach(clearInterval); timers = []; }

    function ensureModal() {
        if (modalEl) return;
        modalEl = document.createElement('div');
        modalEl.className = 'modal';
        modalEl.id = 'lg-modal';
        modalEl.innerHTML = '<div class="modal-content"><span class="modal-close" id="lg-close">&times;</span><div id="lg-body"></div></div>';
        document.body.appendChild(modalEl);
        bodyEl = modalEl.querySelector('#lg-body');
        modalEl.querySelector('#lg-close').addEventListener('click', closeGame);
        modalEl.addEventListener('click', function (e) { if (e.target === modalEl) closeGame(); });
    }
    function openGame(html) { injectStyles(); ensureModal(); stopTimers(); bodyEl.innerHTML = html; modalEl.classList.add('active'); }
    function closeGame() { stopTimers(); if (modalEl) modalEl.classList.remove('active'); }

    function toast(msg) {
        if (typeof window.showToast === 'function') { window.showToast(msg, 4000); return; }
        alert(msg);
    }

    // ============================ JUEGO: MEMORIA ============================
    function startMemory() {
        const set = ['💖', '💗', '💕', '💝', '🌹', '✨', '💫', '😍'];
        const deck = [...set, ...set].sort(() => Math.random() - 0.5);
        let flipped = [], matched = 0, moves = 0, lock = false, start = Date.now();
        const cells = deck.map((e, i) =>
            `<div class="lg-card" data-v="${e}"><div class="lg-card-in"><div class="lg-card-f">❓</div><div class="lg-card-b">${e}</div></div></div>`
        ).join('');
        openGame(`<h2 class="lg-title">Memoria del Amor 🃏</h2>
            <p class="lg-sub">Encuentra las parejas, ${HER} 💗</p>
            <div class="lg-stats"><span>Movimientos: <b id="lg-moves">0</b></span><span>Tiempo: <b id="lg-time">0:00</b></span><span>Parejas: <b id="lg-pairs">0</b>/8</span></div>
            <div class="lg-board">${cells}</div>`);

        track(setInterval(() => {
            const s = Math.floor((Date.now() - start) / 1000);
            const t = document.getElementById('lg-time');
            if (t) t.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        }, 1000));

        bodyEl.querySelectorAll('.lg-card').forEach(card => {
            card.addEventListener('click', () => {
                if (lock || card.classList.contains('flip')) return;
                card.classList.add('flip');
                flipped.push(card);
                if (flipped.length === 2) {
                    moves++; document.getElementById('lg-moves').textContent = moves; lock = true;
                    const [a, b] = flipped;
                    if (a.dataset.v === b.dataset.v) {
                        matched++; document.getElementById('lg-pairs').textContent = matched; flipped = []; lock = false;
                        if (matched === 8) {
                            stopTimers();
                            saveScore('memory', Math.max(0, 1000 - moves * 10));
                            setTimeout(() => toast(`¡Lo lograste, ${NICK}! 💖 En ${moves} movimientos.`), 300);
                        }
                    } else {
                        setTimeout(() => { a.classList.remove('flip'); b.classList.remove('flip'); flipped = []; lock = false; }, 800);
                    }
                }
            });
        });
    }

    // ====================== JUEGO: RAZONES PARA AMARTE ======================
    const reasons = [
        `${HER}, tu sonrisa ilumina hasta mi día más gris.`,
        `Amo cómo tu voz me hace sentir en casa.`,
        `Eres la calma en mi tormenta y mi aventura favorita.`,
        `Contigo hasta lo simple se vuelve mágico.`,
        `Tu forma de amar me hace mejor persona.`,
        `Me enamoro de ti un poco más cada día, ${HER}.`,
        `Eres mi pensamiento favorito al despertar.`,
        `Tu mirada dice más que mil poemas.`,
        `Si pudiera elegir de nuevo, te elegiría siempre.`,
        `Eres mi diosa Freya: belleza, amor y fuerza en una sola persona.`,
        `Tu abrazo es mi lugar seguro en el mundo.`,
        `Haces que el "para siempre" suene poco contigo.`
    ];
    function startReasons() {
        let i = Math.floor(Math.random() * reasons.length);
        openGame(`<h2 class="lg-title">Razones para Amarte 💌</h2>
            <p class="lg-sub">Para ${NICK}</p>
            <div class="lg-reason" id="lg-reason">${reasons[i]}</div>
            <button class="lg-btn" id="lg-next">Otra razón 💞</button>`);
        document.getElementById('lg-next').addEventListener('click', () => {
            i = (i + 1) % reasons.length;
            const el = document.getElementById('lg-reason');
            el.style.opacity = '0';
            setTimeout(() => { el.textContent = reasons[i]; el.style.opacity = '1'; }, 180);
        });
    }

    // ========================= JUEGO: RULETA DEL AMOR =======================
    const rewards = [
        'Un beso 💋', 'Un abrazo largo 🤗', 'Masaje de 5 min 💆', 'Cena romántica 🍝',
        'Película juntos 🎬', 'Un baile lento 💃', 'Vale por un deseo ✨', 'Desayuno en la cama 🥞',
        'Carta de amor ✍️', 'Tarde de mimos 🫶', 'Foto juntos 📸', 'Playlist dedicada 🎵'
    ];
    function startRoulette() {
        openGame(`<h2 class="lg-title">Ruleta del Amor 🎡</h2>
            <p class="lg-sub">Gira y descubre tu premio, ${HER}</p>
            <div class="lg-slot" id="lg-slot">💝 ¡Gira!</div>
            <button class="lg-btn" id="lg-spin">Girar 🎯</button>`);
        document.getElementById('lg-spin').addEventListener('click', function () {
            const slot = document.getElementById('lg-slot');
            this.disabled = true;
            let n = 0; const total = 26 + Math.floor(Math.random() * 10);
            const iv = setInterval(() => {
                slot.textContent = rewards[Math.floor(Math.random() * rewards.length)];
                n++;
                if (n >= total) {
                    clearInterval(iv);
                    const win = rewards[Math.floor(Math.random() * rewards.length)];
                    slot.textContent = '🎁 ' + win;
                    this.disabled = false;
                    toast('Tu premio: ' + win);
                }
            }, 80);
            track(iv);
        });
    }

    // ======================= JUEGO: PIROPOS PARA FREYA =====================
    const piropos = [
        `${HER}, eres más hermosa que todas las estrellas juntas. ✨`,
        `Si Freya es la diosa del amor, tú la dejas en segundo lugar. 💛`,
        `Dicen que la perfección no existe… está claro que no te conocen.`,
        `Tu sonrisa debería estar prohibida: me roba el aliento.`,
        `Eres el "para siempre" que siempre quise. 💞`,
        `Tienes el cielo en la mirada y la primavera en el alma.`,
        `Mi corazón late en tu nombre, ${HER}.`,
        `Eres arte, y yo tu mayor admirador. 🎨`,
        `Contigo aprendí que el amor sí tiene cara: la tuya.`,
        `Eres mi milagro favorito, ${NICK}.`
    ];
    function startPiropos() {
        let i = Math.floor(Math.random() * piropos.length);
        openGame(`<h2 class="lg-title">Piropos para mi Diosa 🌹</h2>
            <p class="lg-sub">Palabras para ${HER}</p>
            <div class="lg-piropo" id="lg-piropo">${piropos[i]}</div>
            <button class="lg-btn" id="lg-pnext">Otro piropo 😍</button>`);
        document.getElementById('lg-pnext').addEventListener('click', () => {
            i = (i + 1) % piropos.length;
            const el = document.getElementById('lg-piropo');
            el.style.opacity = '0';
            setTimeout(() => { el.textContent = piropos[i]; el.style.opacity = '1'; }, 180);
        });
    }

    // ===================== JUEGO: TEST DE COMPATIBILIDAD ===================
    const quiz = [
        { q: 'El plan ideal de fin de semana es…', o: [['Aventura y viajes 🌍', 3], ['Pelis y mantita 🍿', 2], ['Salir con amigos 🥂', 1]] },
        { q: 'Nuestro lenguaje del amor favorito…', o: [['Tiempo de calidad ⏳', 3], ['Palabras bonitas 💬', 2], ['Detalles y regalos 🎁', 2]] },
        { q: 'Ante una discusión…', o: [['Hablamos y resolvemos 🤝', 3], ['Nos damos espacio 🌿', 2], ['Un abrazo lo cura 🤗', 3]] },
        { q: '¿Compartimos la música?', o: [['¡Casi siempre! 🎵', 3], ['A veces 🎧', 2], ['Opuestos que atraen 🎸', 2]] },
        { q: 'Nuestro futuro lo vemos…', o: [['Construyendo todo juntos 🏡', 3], ['Disfrutando el presente 🌅', 2], ['Creciendo juntos 🌱', 3]] }
    ];
    function startCompat() {
        const html = quiz.map((it, qi) =>
            `<div class="lg-qblock"><h4>${qi + 1}. ${it.q}</h4>` +
            it.o.map(op => `<div class="lg-opt" data-q="${qi}" data-p="${op[1]}">${op[0]}</div>`).join('') +
            `</div>`
        ).join('');
        openGame(`<h2 class="lg-title">Test de Compatibilidad 💞</h2>
            <p class="lg-sub">¿Cuánto encajamos, ${HER}?</p>
            ${html}
            <button class="lg-btn" id="lg-compute">Ver resultado 💖</button>
            <div id="lg-cres"></div>`);
        bodyEl.querySelectorAll('.lg-opt').forEach(o => o.addEventListener('click', () => {
            bodyEl.querySelectorAll('.lg-opt[data-q="' + o.dataset.q + '"]').forEach(x => x.classList.remove('sel'));
            o.classList.add('sel');
        }));
        document.getElementById('lg-compute').addEventListener('click', () => {
            let ans = 0, pts = 0;
            for (let i = 0; i < quiz.length; i++) {
                const sel = bodyEl.querySelector('.lg-opt.sel[data-q="' + i + '"]');
                if (sel) { ans++; pts += parseInt(sel.dataset.p, 10); }
            }
            if (ans < quiz.length) { toast('Responde todas las preguntas, ' + HER + ' 💕'); return; }
            const pct = Math.round(85 + (pts / (quiz.length * 3)) * 15);
            let msg = pct >= 98 ? '¡Almas gemelas! 🌌' : pct >= 94 ? '¡Conexión cósmica! 🚀' : pct >= 90 ? '¡Amor verdadero! 📖' : '¡Pareja perfecta! 💪';
            document.getElementById('lg-cres').innerHTML = `<div class="lg-result"><div class="lg-pct">${pct}%</div><p>${msg}</p></div>`;
            saveScore('compat', pct);
        });
    }

    // ======================== JUEGO: PREGUNTA DEL DÍA ======================
    const questions = [
        '¿Cuál es tu recuerdo favorito juntos?',
        '¿Qué fue lo primero que te enamoró de mí?',
        '¿Cómo imaginas nuestro lugar soñado?',
        'Si describieras nuestro amor en una palabra, ¿cuál sería?',
        '¿Qué canción nos representa?',
        '¿Cuál es tu forma favorita de que te demuestre amor?',
        '¿Qué sueño quieres que cumplamos juntos?',
        '¿Qué te hace sentir más amada?'
    ];
    function startQuestion() {
        const q = questions[new Date().getDate() % questions.length];
        openGame(`<h2 class="lg-title">Pregunta del Día ❓</h2>
            <p class="lg-sub">Para ${NICK}</p>
            <p class="lg-q" id="lg-qtext">${q}</p>
            <textarea class="lg-input" id="lg-ans" rows="4" placeholder="Escribe con el corazón..."></textarea>
            <button class="lg-btn" id="lg-save">Guardar respuesta 💌</button>
            <div class="lg-prev" id="lg-prev"></div>`);
        document.getElementById('lg-save').addEventListener('click', async () => {
            const val = document.getElementById('lg-ans').value.trim();
            if (!val) { toast('Escribe tu respuesta primero ✏️'); return; }
            try {
                if (window.db && window.db.saveQuestionAnswer) await window.db.saveQuestionAnswer(q, val);
                else { const a = JSON.parse(localStorage.getItem('questionAnswers') || '[]'); a.push({ question: q, answer: val, date: new Date().toISOString() }); localStorage.setItem('questionAnswers', JSON.stringify(a)); }
                toast('¡Guardado con amor! 💖');
                document.getElementById('lg-ans').value = '';
                loadPrev();
            } catch (e) { toast('No se pudo guardar ahora.'); }
        });
        loadPrev();

        async function loadPrev() {
            const box = document.getElementById('lg-prev');
            if (!box) return;
            try {
                let list = [];
                if (window.db && window.db.getQuestionAnswers) list = await window.db.getQuestionAnswers();
                else list = JSON.parse(localStorage.getItem('questionAnswers') || '[]');
                if (list && list.length) {
                    box.innerHTML = '<h4 style="color:var(--dark-pink,#c96f8e);margin:.5rem 0;">Respuestas anteriores 💭</h4>' +
                        list.slice(0, 5).map(a => `<div class="it"><b>${esc(a.question)}</b>${esc(a.answer)}</div>`).join('');
                }
            } catch (e) { /* sin historial */ }
        }
    }

    // ----------------------------------------------------------------- utils
    function esc(t) { const d = document.createElement('div'); d.textContent = t == null ? '' : t; return d.innerHTML; }
    function saveScore(name, score) {
        try { if (window.db && window.db.saveGameScore) window.db.saveGameScore(name, score); } catch (e) { }
    }

    // --------------------------------------------------------------- registro
    const games = {
        memory: startMemory,
        reasons: startReasons,
        roulette: startRoulette,
        piropos: startPiropos,
        compat: startCompat,
        question: startQuestion,
        galaxy: function () { if (typeof window.startGalaxyLoveGame === 'function') window.startGalaxyLoveGame(); }
    };

    function launch(key) {
        // DIAGNÓSTICO: confirmar que el clic llega y a qué juego (visible en la franja).
        if (window.__lgShowErr) window.__lgShowErr('launch: ' + key);
        try {
            if (games[key]) games[key]();
            else {
                toast('Ese juego no está disponible.');
                if (window.__lgShowErr) window.__lgShowErr('juego no encontrado: ' + key);
            }
        } catch (err) {
            console.error('[LoveGames] error al abrir', key, err);
            if (window.__lgShowErr) window.__lgShowErr('ERROR juego "' + key + '": ' + (err && err.message ? err.message : err));
            toast('Ups, no se pudo abrir el juego. Reintenta 💕');
        }
    }

    function wire() {
        // (1) Delegación en FASE DE CAPTURA: se dispara antes que cualquier otro
        //     listener, así nada puede "robar" el clic con stopPropagation.
        document.addEventListener('click', function (e) {
            const btn = e.target.closest && e.target.closest('[data-game]');
            if (!btn) return;
            e.preventDefault();
            launch(btn.getAttribute('data-game'));
        }, true);

        // (2) Enlace DIRECTO a cada botón, como respaldo. Se reintenta por si las
        //     tarjetas se renderizan más tarde.
        function bindDirect() {
            document.querySelectorAll('[data-game]').forEach(function (b) {
                if (b.__lgBound) return;
                b.__lgBound = true;
                b.style.cursor = 'pointer';
                b.addEventListener('click', function (e) {
                    e.preventDefault();
                    launch(b.getAttribute('data-game'));
                });
            });
        }
        bindDirect();
        setTimeout(bindDirect, 800);
        setTimeout(bindDirect, 2500);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
    else wire();

    window.LoveGames = games;
})();

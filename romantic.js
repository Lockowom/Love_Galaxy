/* ==========================================================================
   LOVE GALAXY — ambientación romántica (JS).
   Para Tamara, mi diosa Freya 💛

   Dos detalles ligeros y autocontenidos, hechos con la Web Animations API
   (sin bucles de render propios, así que son eficientes):
     1) corazones que flotan suavemente de fondo por toda la página.
     2) un pequeño estallido de corazones al pulsar botones.
   Respeta prefers-reduced-motion y se pausa con la pestaña oculta.
   Script clásico (no módulo).
   ========================================================================== */
(function () {
    'use strict';

    var reduce = false;
    try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

    var HEARTS = ['💗', '💕', '💖', '🌸', '💜', '🤍', '🌷'];
    var ambient = null, burst = null;

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick() { return HEARTS[Math.floor(Math.random() * HEARTS.length)]; }

    function layer(id) {
        var d = document.createElement('div');
        d.id = id;
        d.style.cssText = 'position:fixed;inset:0;pointer-events:none;overflow:hidden';
        document.body.appendChild(d);
        return d;
    }

    // --- 1) corazones de fondo flotando hacia arriba ---
    function spawnAmbient() {
        if (document.hidden || !ambient) return;
        var s = document.createElement('span');
        s.textContent = pick();
        var size = rand(14, 30), startX = rand(0, 100);
        s.style.cssText = 'position:absolute;left:' + startX + 'vw;bottom:-44px;font-size:' + size + 'px;' +
            'opacity:0;filter:drop-shadow(0 2px 6px rgba(201,111,142,.30));will-change:transform,opacity';
        ambient.appendChild(s);
        var dur = rand(9, 16), drift = rand(-70, 70), rise = (window.innerHeight || 800) + 140;
        var anim = s.animate([
            { transform: 'translate(0,0) rotate(0deg)', opacity: 0 },
            { opacity: 0.5, offset: 0.12 },
            { opacity: 0.5, offset: 0.85 },
            { transform: 'translate(' + drift + 'px,-' + rise + 'px) rotate(' + rand(-40, 40) + 'deg)', opacity: 0 }
        ], { duration: dur * 1000, easing: 'ease-in-out' });
        anim.onfinish = function () { s.remove(); };
    }
    function scheduleHeart() {
        spawnAmbient();
        setTimeout(scheduleHeart, rand(1500, 3000));
    }

    // --- 2) estallido de corazones al pulsar botones ---
    function burstAt(x, y) {
        if (!burst) return;
        var n = 8;
        for (var i = 0; i < n; i++) {
            var s = document.createElement('span');
            s.textContent = pick();
            s.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;font-size:' + rand(12, 22) + 'px;' +
                'transform:translate(-50%,-50%);will-change:transform,opacity';
            burst.appendChild(s);
            var ang = Math.random() * Math.PI * 2, dist = rand(40, 115);
            var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 20;
            var anim = s.animate([
                { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
                { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) scale(1.15)', opacity: 0 }
            ], { duration: rand(600, 1000), easing: 'cubic-bezier(.2,.7,.3,1)' });
            anim.onfinish = (function (el) { return function () { el.remove(); }; })(s);
        }
    }
    function onClick(e) {
        if (reduce) return;
        var t = e.target.closest && e.target.closest('.btn-primary,.btn-game,.btn-featured,.hero-btn,.btn-love');
        if (!t) return;
        // Evitar interferir con el juego a pantalla completa.
        if (e.target.closest && e.target.closest('#galaxy-game-modal')) return;
        burstAt(e.clientX, e.clientY);
    }

    function init() {
        if (!document.body) return;
        ambient = layer('romantic-hearts');
        burst = layer('romantic-burst');
        document.addEventListener('click', onClick, true);
        if (!reduce) scheduleHeart();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

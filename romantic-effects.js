// ================================================
// EFECTOS ROMÁNTICOS ADICIONALES
// ================================================

// ===================================
// BURBUJAS DE AMOR FLOTANTES
// ===================================
class LoveBubblesEffect {
    constructor() {
        this.container = null;
        this.bubbles = [];
        this.maxBubbles = 15;
        this.bubbleEmojis = ['💕', '💖', '💗', '💓', '💞', '💝', '❤️', '💘', '✨', '⭐', '🌟'];
        this.isActive = false;
    }

    init() {
        // Crear contenedor
        this.container = document.createElement('div');
        this.container.className = 'love-bubbles';
        this.container.id = 'love-bubbles-container';
        document.body.appendChild(this.container);
        
        this.isActive = true;
        this.generateBubbles();
        
        setInterval(() => {
            if (this.isActive) {
                this.addBubble();
            }
        }, 2000);
    }

    generateBubbles() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.addBubble(), i * 400);
        }
    }

    addBubble() {
        if (this.bubbles.length >= this.maxBubbles) {
            const oldBubble = this.bubbles.shift();
            if (oldBubble && oldBubble.parentNode) {
                oldBubble.remove();
            }
        }

        const bubble = document.createElement('div');
        bubble.className = 'love-bubble';
        bubble.textContent = this.bubbleEmojis[Math.floor(Math.random() * this.bubbleEmojis.length)];
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 10 + 10) + 's';
        bubble.style.animationDelay = Math.random() * 2 + 's';
        
        this.container.appendChild(bubble);
        this.bubbles.push(bubble);

        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
                this.bubbles = this.bubbles.filter(b => b !== bubble);
            }
        }, 20000);
    }

    toggle() {
        this.isActive = !this.isActive;
        if (this.container) {
            this.container.style.display = this.isActive ? 'block' : 'none';
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }
        this.bubbles = [];
        this.isActive = false;
    }
}

// ===================================
// LLUVIA DE ESTRELLAS
// ===================================
class StarRainEffect {
    constructor() {
        this.container = null;
        this.stars = [];
        this.maxStars = 20;
        this.starEmojis = ['⭐', '✨', '🌟', '💫'];
        this.isActive = false;
    }

    init() {
        this.container = document.createElement('div');
        this.container.className = 'star-rain';
        this.container.id = 'star-rain-container';
        document.body.appendChild(this.container);
        
        this.isActive = true;
        
        setInterval(() => {
            if (this.isActive) {
                this.addStar();
            }
        }, 800);
    }

    addStar() {
        if (this.stars.length >= this.maxStars) {
            const oldStar = this.stars.shift();
            if (oldStar && oldStar.parentNode) {
                oldStar.remove();
            }
        }

        const star = document.createElement('div');
        star.className = 'falling-star';
        star.textContent = this.starEmojis[Math.floor(Math.random() * this.starEmojis.length)];
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        star.style.fontSize = (Math.random() * 1 + 1) + 'rem';
        
        this.container.appendChild(star);
        this.stars.push(star);

        setTimeout(() => {
            if (star.parentNode) {
                star.remove();
                this.stars = this.stars.filter(s => s !== star);
            }
        }, 5000);
    }

    toggle() {
        this.isActive = !this.isActive;
        if (this.container) {
            this.container.style.display = this.isActive ? 'block' : 'none';
        }
    }

    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }
        this.stars = [];
        this.isActive = false;
    }
}

// ===================================
// EFECTO DE CLICK CON CORAZONES
// ===================================
class HeartClickEffect {
    constructor() {
        this.heartEmojis = ['💕', '💖', '💗', '💓', '💞', '💝', '❤️', '💘'];
        this.isActive = true;
    }

    init() {
        document.addEventListener('click', (e) => {
            if (this.isActive && !e.target.closest('button, a, input, textarea, select')) {
                this.createHeartExplosion(e.clientX, e.clientY);
            }
        });
    }

    createHeartExplosion(x, y) {
        const heartCount = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.textContent = this.heartEmojis[Math.floor(Math.random() * this.heartEmojis.length)];
            heart.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: ${Math.random() * 20 + 20}px;
                pointer-events: none;
                z-index: 9999;
                animation: heartExplosion ${Math.random() * 0.5 + 0.8}s ease-out forwards;
                transform: translate(-50%, -50%);
            `;
            
            const angle = (Math.PI * 2 * i) / heartCount;
            const distance = Math.random() * 100 + 50;
            heart.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
            heart.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
            
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 1000);
        }
    }

    toggle() {
        this.isActive = !this.isActive;
    }
}

// CSS para la animación de explosión de corazones
const heartExplosionStyle = document.createElement('style');
heartExplosionStyle.textContent = `
    @keyframes heartExplosion {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1);
        }
    }
`;
document.head.appendChild(heartExplosionStyle);

// ===================================
// MENSAJE ROMÁNTICO FLOTANTE
// ===================================
class FloatingLoveMessage {
    constructor() {
        this.messages = [
            "Te amo, Tamara 💕",
            "Eres mi todo 💖",
            "Mi corazón es tuyo 💗",
            "Amor eterno 💓",
            "Juntos por siempre 💞",
            "Eres perfecta 💝",
            "Mi alma gemela ❤️",
            "Te adoro 💘",
            "Mi vida eres tú 🌟",
            "Eres mi felicidad ✨",
            "Mi amor infinito ♾️"
        ];
        this.isActive = true;
    }

    init() {
        setInterval(() => {
            if (this.isActive) {
                this.showRandomMessage();
            }
        }, 15000); // Cada 15 segundos
    }

    showRandomMessage() {
        const message = this.messages[Math.floor(Math.random() * this.messages.length)];
        const messageEl = document.createElement('div');
        
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, rgba(255, 20, 147, 0.9), rgba(255, 105, 180, 0.9));
            color: white;
            padding: 1rem 2rem;
            border-radius: 30px;
            font-size: 1.2rem;
            font-family: 'Dancing Script', cursive;
            z-index: 9998;
            box-shadow: 0 10px 40px rgba(255, 20, 147, 0.5);
            animation: floatInOut 4s ease-in-out forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => messageEl.remove(), 4000);
    }

    toggle() {
        this.isActive = !this.isActive;
    }
}

const floatInOutStyle = document.createElement('style');
floatInOutStyle.textContent = `
    @keyframes floatInOut {
        0% {
            opacity: 0;
            transform: translateX(100px) scale(0.5);
        }
        20%, 80% {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateX(-100px) scale(0.5);
        }
    }
`;
document.head.appendChild(floatInOutStyle);

// ===================================
// CURSOR PERSONALIZADO ROMÁNTICO
// ===================================
class RomanticCursor {
    constructor() {
        this.cursor = null;
        this.trail = [];
        this.maxTrail = 8;
        this.isActive = true;
    }

    init() {
        // Cursor principal
        this.cursor = document.createElement('div');
        this.cursor.style.cssText = `
            position: fixed;
            width: 25px;
            height: 25px;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.1s ease;
            font-size: 25px;
            transform: translate(-50%, -50%);
        `;
        this.cursor.textContent = '💖';
        document.body.appendChild(this.cursor);

        // Trail
        for (let i = 0; i < this.maxTrail; i++) {
            const trailPiece = document.createElement('div');
            trailPiece.style.cssText = `
                position: fixed;
                width: ${20 - i * 2}px;
                height: ${20 - i * 2}px;
                pointer-events: none;
                z-index: ${9999 - i};
                transition: all 0.2s ease;
                font-size: ${20 - i * 2}px;
                opacity: ${1 - i * 0.12};
                transform: translate(-50%, -50%);
            `;
            trailPiece.textContent = '💕';
            document.body.appendChild(trailPiece);
            this.trail.push(trailPiece);
        }

        document.addEventListener('mousemove', (e) => {
            if (this.isActive) {
                this.updateCursor(e.clientX, e.clientY);
            }
        });

        document.addEventListener('mousedown', () => {
            if (this.isActive && this.cursor) {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isActive && this.cursor) {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    }

    updateCursor(x, y) {
        if (this.cursor) {
            this.cursor.style.left = x + 'px';
            this.cursor.style.top = y + 'px';
        }

        this.trail.forEach((piece, index) => {
            setTimeout(() => {
                piece.style.left = x + 'px';
                piece.style.top = y + 'px';
            }, index * 20);
        });
    }

    toggle() {
        this.isActive = !this.isActive;
        if (this.cursor) {
            this.cursor.style.display = this.isActive ? 'block' : 'none';
        }
        this.trail.forEach(piece => {
            piece.style.display = this.isActive ? 'block' : 'none';
        });
    }

    destroy() {
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.remove();
        }
        this.trail.forEach(piece => {
            if (piece.parentNode) {
                piece.remove();
            }
        });
        this.trail = [];
    }
}

// ===================================
// PANEL DE CONTROL DE EFECTOS
// ===================================
class EffectsControlPanel {
    constructor() {
        this.panel = null;
        this.isVisible = false;
    }

    init() {
        this.panel = document.createElement('div');
        this.panel.id = 'effects-control-panel';
        this.panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(10, 10, 30, 0.95);
            border: 2px solid rgba(255, 20, 147, 0.5);
            border-radius: 15px;
            padding: 1.5rem;
            z-index: 9997;
            box-shadow: 0 10px 40px rgba(255, 20, 147, 0.3);
            transform: translateX(-120%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        this.panel.innerHTML = `
            <h3 style="color: #ff1493; margin-bottom: 1rem; font-family: 'Poppins', sans-serif;">
                ✨ Efectos Románticos
            </h3>
            <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                <label style="color: white; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" id="toggle-bubbles" checked>
                    <span>💕 Burbujas de Amor</span>
                </label>
                <label style="color: white; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" id="toggle-stars" checked>
                    <span>⭐ Lluvia de Estrellas</span>
                </label>
                <label style="color: white; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" id="toggle-click-hearts" checked>
                    <span>💖 Corazones al Click</span>
                </label>
                <label style="color: white; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" id="toggle-messages" checked>
                    <span>💌 Mensajes Flotantes</span>
                </label>
                <label style="color: white; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                    <input type="checkbox" id="toggle-cursor" checked>
                    <span>🖱️ Cursor Romántico</span>
                </label>
            </div>
        `;

        document.body.appendChild(this.panel);

        // Botón toggle
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggle-effects-btn';
        toggleBtn.textContent = '✨';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid #ff1493;
            background: linear-gradient(135deg, #ff1493, #ff69b4);
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 5px 20px rgba(255, 20, 147, 0.5);
            transition: all 0.3s ease;
        `;

        toggleBtn.addEventListener('click', () => this.toggle());
        document.body.appendChild(toggleBtn);

        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'scale(1.1) rotate(15deg)';
        });

        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    toggle() {
        this.isVisible = !this.isVisible;
        if (this.panel) {
            this.panel.style.transform = this.isVisible ? 'translateX(70px)' : 'translateX(-120%)';
        }
    }
}

// ===================================
// INICIALIZACIÓN GLOBAL
// ===================================
let loveBubbles = null;
let starRain = null;
let heartClick = null;
let floatingMessage = null;
let romanticCursor = null;
let controlPanel = null;

function initRomanticEffects() {
    // Inicializar todos los efectos
    loveBubbles = new LoveBubblesEffect();
    loveBubbles.init();

    starRain = new StarRainEffect();
    starRain.init();

    heartClick = new HeartClickEffect();
    heartClick.init();

    floatingMessage = new FloatingLoveMessage();
    floatingMessage.init();

    romanticCursor = new RomanticCursor();
    romanticCursor.init();

    controlPanel = new EffectsControlPanel();
    controlPanel.init();

    // Configurar controles
    document.getElementById('toggle-bubbles')?.addEventListener('change', (e) => {
        loveBubbles?.toggle();
    });

    document.getElementById('toggle-stars')?.addEventListener('change', (e) => {
        starRain?.toggle();
    });

    document.getElementById('toggle-click-hearts')?.addEventListener('change', (e) => {
        heartClick?.toggle();
    });

    document.getElementById('toggle-messages')?.addEventListener('change', (e) => {
        floatingMessage?.toggle();
    });

    document.getElementById('toggle-cursor')?.addEventListener('change', (e) => {
        romanticCursor?.toggle();
    });
}

// Iniciar cuando la página cargue
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRomanticEffects);
} else {
    initRomanticEffects();
}

// Exportar para uso global
window.RomanticEffects = {
    loveBubbles,
    starRain,
    heartClick,
    floatingMessage,
    romanticCursor,
    controlPanel
};

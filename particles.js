// ================================================
// SISTEMA DE PARTÍCULAS - CORAZONES Y ESTRELLAS
// ================================================

class Particle {
    constructor(canvas, type = 'heart') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = this.canvas.height + 50;
        this.size = Math.random() * 20 + 10;
        this.speedY = Math.random() * -2 - 1;
        this.speedX = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.swing = Math.random() * 0.05;
        this.swingOffset = Math.random() * Math.PI * 2;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * this.swing + this.swingOffset) * 0.5;
        this.opacity -= 0.002;

        // Reset si sale de la pantalla
        if (this.y < -50 || this.opacity <= 0) {
            this.reset();
        }

        // Mantener dentro de los límites horizontales
        if (this.x < -50) this.x = this.canvas.width + 50;
        if (this.x > this.canvas.width + 50) this.x = -50;
    }

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.font = `${this.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        if (this.type === 'heart') {
            const hearts = ['💕', '💖', '💗', '💓', '💞', '💝'];
            const heart = hearts[Math.floor(Math.random() * hearts.length)];
            this.ctx.fillText(heart, this.x, this.y);
        } else {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('✨', this.x, this.y);
        }

        this.ctx.restore();
    }
}

class Star {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2;
        this.speedY = Math.random() * 0.5;
        this.opacity = Math.random();
        this.twinkleSpeed = Math.random() * 0.05 + 0.01;
    }

    update() {
        this.y += this.speedY;
        this.opacity += this.twinkleSpeed;

        // Efecto de parpadeo
        if (this.opacity >= 1 || this.opacity <= 0) {
            this.twinkleSpeed *= -1;
        }

        // Reset si sale de la pantalla
        if (this.y > this.canvas.height) {
            this.y = 0;
            this.x = Math.random() * this.canvas.width;
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}

// ================================================
// SISTEMA DE MANAGER DE PARTÍCULAS
// ================================================

class ParticleSystem {
    constructor(canvasId, particleType, count) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particleType = particleType;
        this.particles = [];
        this.count = count;

        this.resizeCanvas();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.count; i++) {
            if (this.particleType === 'star') {
                this.particles.push(new Star(this.canvas));
            } else {
                this.particles.push(new Particle(this.canvas, 'heart'));
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ================================================
// INICIALIZACIÓN
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    // Sistema de estrellas de fondo
    new ParticleSystem('stars-canvas', 'star', 100);

    // Sistema de corazones flotantes
    new ParticleSystem('hearts-canvas', 'heart', 15);
});

// ================================================
// EFECTOS ESPECIALES DE MOUSE
// ================================================

class MouseTrail {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };

        this.resizeCanvas();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Inicialización
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        // Crear partículas con menos frecuencia
        if (Math.random() < 0.1) {
            this.createParticle(e.clientX, e.clientY);
        }
    }

    createParticle(x, y) {
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 10 + 5,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            opacity: 1,
            emoji: ['💕', '✨', '💖', '⭐'][Math.floor(Math.random() * 4)]
        };
        this.particles.push(particle);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.opacity -= 0.02;

            if (particle.opacity <= 0) {
                this.particles.splice(index, 1);
                return;
            }

            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.font = `${particle.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(particle.emoji, particle.x, particle.y);
            this.ctx.restore();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar efecto de mouse
document.addEventListener('DOMContentLoaded', () => {
    new MouseTrail();
});

// ================================================
// EFECTOS DE CLICK - EXPLOSIÓN DE CORAZONES
// ================================================

class HeartExplosion {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.explosions = [];

        this.resizeCanvas();
        this.animate();

        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('click', (e) => this.createExplosion(e.clientX, e.clientY));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createExplosion(x, y) {
        const particleCount = 15;
        const particles = [];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 3 + 2;

            particles.push({
                x: x,
                y: y,
                speedX: Math.cos(angle) * velocity,
                speedY: Math.sin(angle) * velocity,
                size: Math.random() * 15 + 10,
                opacity: 1,
                gravity: 0.1,
                emoji: ['💕', '💖', '💗', '💓', '💞', '💝'][Math.floor(Math.random() * 6)]
            });
        }

        this.explosions.push(particles);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.explosions.forEach((explosion, explosionIndex) => {
            explosion.forEach((particle, particleIndex) => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.speedY += particle.gravity;
                particle.opacity -= 0.015;

                if (particle.opacity <= 0) {
                    explosion.splice(particleIndex, 1);
                    return;
                }

                this.ctx.save();
                this.ctx.globalAlpha = particle.opacity;
                this.ctx.font = `${particle.size}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(particle.emoji, particle.x, particle.y);
                this.ctx.restore();
            });

            if (explosion.length === 0) {
                this.explosions.splice(explosionIndex, 1);
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar explosión de corazones
document.addEventListener('DOMContentLoaded', () => {
    new HeartExplosion();
});

// ================================================
// EFECTO DE BRILLOS EN TÍTULOS
// ================================================

class ShineEffect {
    constructor() {
        this.init();
    }

    init() {
        const titles = document.querySelectorAll('.section-title, .hero-name');
        
        titles.forEach(title => {
            title.addEventListener('mouseenter', () => {
                this.createShine(title);
            });
        });
    }

    createShine(element) {
        const rect = element.getBoundingClientRect();
        const shine = document.createElement('div');
        
        shine.style.cssText = `
            position: absolute;
            top: ${rect.top}px;
            left: ${rect.left}px;
            width: ${rect.width}px;
            height: ${rect.height}px;
            pointer-events: none;
            overflow: hidden;
        `;

        const shineInner = document.createElement('div');
        shineInner.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
            animation: shine 1s ease;
        `;

        shine.appendChild(shineInner);
        document.body.appendChild(shine);

        setTimeout(() => {
            shine.remove();
        }, 1000);
    }
}

// Inicializar efecto de brillo
document.addEventListener('DOMContentLoaded', () => {
    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shine {
            from { left: -100%; }
            to { left: 100%; }
        }
    `;
    document.head.appendChild(style);

    new ShineEffect();
});

// ================================================
// EFECTO DE ONDAS AL HACER CLICK
// ================================================

document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        border-radius: 50%;
        border: 2px solid rgba(255, 20, 147, 0.6);
        pointer-events: none;
        animation: ripple 1s ease-out;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transform: translate(-50%, -50%);
        z-index: 9997;
    `;

    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 1000);
});

// Agregar animación de onda
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

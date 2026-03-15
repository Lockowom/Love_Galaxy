// ================================================
// ANIMACIONES AVANZADAS Y EFECTOS VISUALES
// ================================================

// ================================================
// EFECTO DE TEXTO TYPING
// ================================================

class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (!this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            
            if (this.charIndex === currentText.length) {
                this.isPaused = true;
                setTimeout(() => {
                    this.isDeleting = true;
                    this.isPaused = false;
                }, 2000);
            }
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
            }
        }
        
        if (!this.isPaused) {
            const timeout = this.isDeleting ? this.speed / 2 : this.speed;
            setTimeout(() => this.type(), timeout);
        } else {
            setTimeout(() => this.type(), this.speed);
        }
    }

    start() {
        this.type();
    }
}

// ================================================
// EFECTO DE PARALLAX EN SCROLL
// ================================================

class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.handleScroll();
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ================================================
// CONTADOR ANIMADO
// ================================================

function animateValue(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ================================================
// EFECTO DE REVELAR AL SCROLL
// ================================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-on-scroll');
        this.init();
    }

    init() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(element => {
            observer.observe(element);
        });
    }
}

// ================================================
// EFECTO DE CURSOR PERSONALIZADO
// ================================================

class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursorFollower = document.createElement('div');
        this.init();
    }

    init() {
        this.cursor.className = 'custom-cursor';
        this.cursorFollower.className = 'custom-cursor-follower';
        
        this.cursor.style.cssText = `
            width: 10px;
            height: 10px;
            background: var(--primary-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            transition: transform 0.1s ease;
        `;
        
        this.cursorFollower.style.cssText = `
            width: 40px;
            height: 40px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.15s ease;
            opacity: 0.5;
        `;
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
        
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                this.cursorFollower.style.left = (e.clientX - 20) + 'px';
                this.cursorFollower.style.top = (e.clientY - 20) + 'px';
            }, 50);
        });
        
        // Efecto hover en elementos interactivos
        const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-small, .btn-game');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
                this.cursorFollower.style.transform = 'scale(1.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = 'scale(1)';
            });
        });
    }
}

// ================================================
// EFECTO DE CONFETI
// ================================================

class ConfettiEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    createParticle(x, y) {
        const colors = ['#ff1493', '#ff69b4', '#ffd700', '#ff6b9d', '#c71585'];
        return {
            x: x,
            y: y,
            color: colors[Math.floor(Math.random() * colors.length)],
            radius: Math.random() * 6 + 2,
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * -8 - 2,
            gravity: 0.3,
            opacity: 1
        };
    }

    burst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(x, y));
        }
        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.speedY += particle.gravity;
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.opacity -= 0.01;
            
            if (particle.opacity <= 0 || particle.y > this.canvas.height) {
                this.particles.splice(index, 1);
                return;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// ================================================
// EFECTO DE TEXTO 3D
// ================================================

class Text3DEffect {
    constructor(elements) {
        this.elements = elements || document.querySelectorAll('.text-3d');
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }
}

// ================================================
// EFECTO DE OLAS ANIMADAS
// ================================================

class WaveEffect {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.amplitude = 20;
        this.frequency = 0.02;
        this.speed = 0.05;
        
        this.resize();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = 200;
    }

    drawWave(offset, alpha) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        
        for (let x = 0; x < this.canvas.width; x++) {
            const y = this.canvas.height / 2 + 
                     Math.sin(x * this.frequency + this.time + offset) * this.amplitude;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.closePath();
        
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, `rgba(255, 20, 147, ${alpha})`);
        gradient.addColorStop(1, `rgba(255, 105, 180, ${alpha * 0.5})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawWave(0, 0.3);
        this.drawWave(Math.PI / 2, 0.2);
        this.drawWave(Math.PI, 0.1);
        
        this.time += this.speed;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ================================================
// EFECTO DE FLOATING ELEMENTS
// ================================================

class FloatingElements {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.elements.forEach((element, index) => {
            const duration = 3 + Math.random() * 2;
            const delay = index * 0.2;
            const distance = 10 + Math.random() * 20;
            
            element.style.animation = `
                float ${duration}s ease-in-out ${delay}s infinite
            `;
            
            // Crear keyframes dinámicos
            const keyframeName = `float-${index}`;
            const keyframes = `
                @keyframes ${keyframeName} {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-${distance}px); }
                }
            `;
            
            const style = document.createElement('style');
            style.textContent = keyframes;
            document.head.appendChild(style);
            
            element.style.animationName = keyframeName;
        });
    }
}

// ================================================
// EFECTO DE ZOOM EN IMÁGENES
// ================================================

class ImageZoomEffect {
    constructor() {
        this.images = document.querySelectorAll('.zoomable-image');
        this.init();
    }

    init() {
        this.images.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => this.zoom(img));
        });
    }

    zoom(img) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: zoom-out;
            animation: fadeIn 0.3s ease;
        `;
        
        const zoomedImg = img.cloneNode();
        zoomedImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            animation: zoomIn 0.3s ease;
        `;
        
        overlay.appendChild(zoomedImg);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        });
    }
}

// ================================================
// EFECTO DE PROGRESS BAR ANIMADO
// ================================================

class AnimatedProgressBar {
    constructor(element, targetValue, duration = 2000) {
        this.element = element;
        this.targetValue = targetValue;
        this.duration = duration;
        this.currentValue = 0;
    }

    animate() {
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.currentValue = this.targetValue * easeOut;
            
            this.element.style.width = `${this.currentValue}%`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        requestAnimationFrame(update);
    }
}

// ================================================
// EFECTO DE GLITCH
// ================================================

class GlitchEffect {
    constructor(element) {
        this.element = element;
        this.originalText = element.textContent;
        this.isGlitching = false;
    }

    glitch(duration = 1000) {
        if (this.isGlitching) return;
        
        this.isGlitching = true;
        const startTime = Date.now();
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        const interval = setInterval(() => {
            if (Date.now() - startTime > duration) {
                clearInterval(interval);
                this.element.textContent = this.originalText;
                this.isGlitching = false;
                return;
            }
            
            let glitchedText = '';
            for (let char of this.originalText) {
                if (Math.random() < 0.1) {
                    glitchedText += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    glitchedText += char;
                }
            }
            this.element.textContent = glitchedText;
        }, 50);
    }
}

// ================================================
// INICIALIZACIÓN
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar efectos
    new ParallaxEffect();
    new ScrollReveal();
    
    // Cursor personalizado (opcional, puede molestar en móviles)
    if (window.innerWidth > 768) {
        new CustomCursor();
    }
    
    // Floating elements
    new FloatingElements('.floating-heart');
    
    // Confeti global
    window.confetti = new ConfettiEffect();
    
    // Aplicar efecto 3D a títulos
    new Text3DEffect(document.querySelectorAll('.hero-name'));
    
    console.log('✨ Sistema de animaciones cargado correctamente');
});

// ================================================
// FUNCIONES GLOBALES ÚTILES
// ================================================

// Trigger confeti desde cualquier lugar
window.triggerConfetti = function(x, y, count = 50) {
    if (window.confetti) {
        window.confetti.burst(x || window.innerWidth / 2, y || window.innerHeight / 2, count);
    }
};

// Smooth scroll a cualquier elemento
window.smoothScrollTo = function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Mostrar notificación toast
window.showToast = function(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(255, 20, 147, 0.5);
        z-index: 10001;
        animation: slideInUp 0.5s ease;
        font-weight: 600;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, duration);
};

// Agregar animaciones CSS necesarias
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(100px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(100px);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .reveal-on-scroll {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .reveal-on-scroll.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(animationStyles);

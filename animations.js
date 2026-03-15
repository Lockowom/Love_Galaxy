// ================================================
// ANIMACIONES GSAP - LOVE GALAXY
// ================================================

// Registrar plugins de GSAP de forma segura
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
} else {
    console.warn("⚠️ GSAP o ScrollTrigger no cargaron correctamente. Las animaciones se desactivarán.");
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') return;
    
    try {
        initHeroAnimations();
        initScrollAnimations();
        initHoverEffects();
        initFloatingElements();
    } catch (e) {
        console.error("Error inicializando animaciones:", e);
    }
});

function initHeroAnimations() {
    const tl = gsap.timeline();

    tl.from('.hero-title', {
        duration: 1.2,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    })
    .from('.hero-name', {
        duration: 1.5,
        scale: 0.5,
        opacity: 0,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.1
    }, '-=0.5')
    .from('.hero-subtitle', {
        duration: 1,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
    }, '-=1')
    .from('.stat-card', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    }, '-=0.5')
    .from('.hero-btn', {
        duration: 0.8,
        scale: 0,
        opacity: 0,
        ease: 'elastic.out(1, 0.3)'
    }, '-=0.3');
}

function initScrollAnimations() {
    // Títulos de Sección
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Timeline Items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            x: i % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Galería Items
    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });

    // Parallax suave para fondos
    gsap.to('.hero-section', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        opacity: 0.5
    });
}

function initHoverEffects() {
    // Botones con efecto magnético suave
    const buttons = document.querySelectorAll('.btn-primary, .btn-small');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.3,
                ease: 'power1.out'
            });
        });
    });
}

function initFloatingElements() {
    // Corazones flotantes en el hero
    gsap.to('.floating-heart', {
        y: -20,
        rotation: 10,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: {
            amount: 1.5,
            from: "random"
        }
    });
}

// Función global para notificaciones (Toast) usando GSAP o Fallback
window.showNotification = function(message, type = 'info') {
    // Eliminar anterior si existe
    const existingToast = document.querySelector('.gsap-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `gsap-toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(20, 10, 30, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        border: 1px solid var(--primary-color);
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
        backdrop-filter: blur(10px);
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    `;
    
    // Icono según tipo
    let icon = '✨';
    if (type === 'error') icon = '❌';
    if (type === 'success') icon = '✅';
    
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    // Animación entrada
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(toast, 
            { y: 50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );

        // Animación salida automática
        gsap.to(toast, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            delay: 3,
            ease: 'power2.in',
            onComplete: () => {
                if(toast.parentNode) toast.remove();
            }
        });
    } else {
        // Fallback CSS puro
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if(toast.parentNode) toast.remove();
            }, 500);
        }, 3000);
    }
};

// Reemplazar alerts nativos por notificaciones bonitas
window.alert = function(msg) {
    window.showNotification(msg, 'info');
};

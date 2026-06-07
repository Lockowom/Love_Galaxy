// ================================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ================================================

// Fecha de inicio de la relación (se cargará de la DB)
let relationshipStart = new Date('2024-01-01');


// Frases de amor
const loveQuotes = [
    "En un océano de personas, mis ojos siempre te buscarán a ti.",
    "Eres la razón por la que creo en el amor verdadero.",
    "Contigo, el tiempo se detiene y todo tiene sentido.",
    "Tu sonrisa es mi lugar favorito en el mundo.",
    "Amo la forma en que me haces sentir cuando estoy contigo.",
    "Tú eres mi hoy y todos mis mañanas.",
    "En tus ojos encontré mi hogar.",
    "Cada momento contigo es mi momento favorito.",
    "Me enamoré de ti por mil razones, y sigo encontrando más cada día.",
    "Eres mi persona favorita, mi mejor decisión.",
    "Tu amor es la mejor aventura que he vivido.",
    "Contigo, he encontrado el amor que creía solo existía en los cuentos.",
    "Eres la respuesta a todas las preguntas que nunca supe que tenía.",
    "Mi corazón es tuyo, eternamente.",
    "Eres mi sol en los días grises y mi estrella en las noches oscuras."
];

// Mensajes diarios (Expandidos y mejorados)
const dailyMessages = [
    "Buenos días, mi amor. Que tengas un día tan hermoso como tú. 💕",
    "Pensé en ti al despertar, y eso me hizo sonreír. ✨",
    "Cada día contigo es un regalo. Gracias por existir. 🎁",
    "Tu amor me da fuerzas para conquistar el mundo. 💪❤️",
    "No importa qué tan difícil sea el día, tu amor lo hace todo mejor. 🌟",
    "Eres lo mejor que me ha pasado en la vida. Te amo infinitamente. 💖",
    "Cuando estoy contigo, siento que estoy exactamente donde debo estar. 🏡",
    "Tu risa es mi melodía favorita. Nunca dejes de sonreír. 😊",
    "Gracias por amarme tal como soy. Eres mi bendición. 🙏",
    "Hoy y siempre, eres mi razón para ser feliz. 💕",
    "Mi día favorito es cualquier día que pase contigo. 🌈",
    "Tu amor es la luz que ilumina mi camino. ✨",
    "No necesito nada más en la vida, solo a ti. 💗",
    "Eres mi sueño hecho realidad. 🌙",
    "Cada segundo contigo vale más que una eternidad sin ti. ⏰❤️",
    "Eres la casualidad más bonita de mi vida. 💫",
    "Mi corazón late al ritmo de tu nombre. 💓",
    "Eres mi paz en medio del caos. 🕊️",
    "Contigo, el infinito se queda pequeño. ♾️",
    "Tus abrazos son mi lugar seguro. 🤗",
    "Amarte es mi pasatiempo favorito. 🎨",
    "Eres la poesía que nunca supe escribir. 📜",
    "Tu mirada tiene el brillo de mil galaxias. 🌌",
    "Gracias por ser mi compañera de aventuras. 🚀",
    "Eres el sol que calienta mis días fríos. ☀️",
    "Mi amor por ti crece con cada latido. 📈",
    "Eres magia pura en un mundo ordinario. ✨",
    "Juntos somos invencibles. 🛡️",
    "Tu voz es mi sonido favorito del universo. 🎶",
    "Eres la pieza que le faltaba a mi rompecabezas. 🧩",
    "Te elijo hoy, mañana y siempre. 💍",
    "Eres mi refugio, mi hogar y mi todo. 🏠",
    "Cada día me enamoro más de ti. 💘",
    "Eres la estrella que guía mi norte. ⭐",
    "Tu felicidad es mi prioridad. 😊",
    "Gracias por llenar mi vida de colores. 🎨",
    "Eres mi mejor amiga y mi gran amor. 👫",
    "No cambiaría ni un segundo de nuestra historia. 📖",
    "Eres el sueño del que no quiero despertar. 💤",
    "Te amo más allá de las palabras. 😶",
    "Eres mi presente y mi futuro. 🎁",
    "Contigo, cada día es una nueva aventura. 🗺️",
    "Tu amor es el motor de mi vida. 🚗",
    "Eres la melodía que siempre quiero escuchar. 🎵",
    "Mi alma reconoció a la tuya al instante. 👻",
    "Eres perfecta tal y como eres. 💎",
    "Te amo hasta la luna y de regreso (a pasitos de tortuga). 🐢",
    "Eres mi serendipia favorita. 🍀",
    "Gracias por hacerme la persona más feliz del mundo. 🌍",
    "Tú y yo, contra el mundo. 🤜🤛"
];

// Poemas del Universo
const cosmicPoems = [
    {
        title: "Gravedad",
        content: "No es la gravedad la que me ata a la tierra,\neres tú quien me mantiene en órbita.\nTu amor es la fuerza invisible\nque da sentido a mi universo."
    },
    {
        title: "Polvo de Estrellas",
        content: "Dicen que estamos hechos de estrellas,\npero tú brillas con luz propia.\nEn la inmensidad del cosmos,\nte encontré a ti, mi supernova."
    },
    {
        title: "Eclipse",
        content: "Cuando te miro, el mundo se apaga.\nEres el eclipse que detiene mi tiempo,\nla sombra y la luz,\nel misterio que siempre quiero resolver."
    },
    {
        title: "Constelación",
        content: "Si uniera mis lunares con los tuyos,\ndibujaría el mapa del tesoro.\nEres mi constelación favorita,\nel norte que guía mis pasos."
    },
    {
        title: "Infinito",
        content: "El universo se expande sin fin,\ncomo mi amor por ti.\nNo hay límites, no hay fronteras,\nsolo tú, yo y la eternidad."
    }
];

// Ideas para citas
const dateIdeas = [
    "🌅 Ver el amanecer juntos con café caliente",
    "🎬 Noche de películas con palomitas caseras",
    "🍝 Cocinar una cena romántica juntos",
    "🌳 Picnic en el parque con tu comida favorita",
    "⭐ Observar las estrellas y hablar de sueños",
    "🎨 Clase de arte o pintura en pareja",
    "🚴 Paseo en bicicleta al atardecer",
    "☕ Visitar esa cafetería acogedora que te gusta",
    "🎵 Concierto o música en vivo",
    "🏖️ Día en la playa construyendo castillos de arena",
    "🎪 Parque de diversiones y risas sin parar",
    "📚 Tarde de lectura en la biblioteca o librería",
    "🍷 Cena con velas y música romántica",
    "🌺 Visitar un jardín botánico",
    "🎭 Noche de teatro o comedia",
    "🏛️ Explorar un museo interesante",
    "🍦 Buscar la mejor heladería de la ciudad",
    "🌃 Paseo nocturno por el centro de la ciudad",
    "🎮 Noche de videojuegos retro",
    "🧘 Sesión de yoga o meditación en pareja"
];

// Actividades de la ruleta
const rouletteActivities = [
    "Dale un masaje relajante",
    "Cocina su comida favorita",
    "Escribe una carta de amor",
    "Planea una sorpresa especial",
    "Vean fotos antiguas juntos",
    "Bailen su canción favorita",
    "Hagan una videollamada larga",
    "Compartan sus sueños",
    "Jueguen un juego de mesa",
    "Cuéntale 10 cosas que amas de ella",
    "Prepara un postre delicioso",
    "Miren las estrellas juntos"
];

// Preguntas del día
const dailyQuestions = [
    {
        question: "¿Cuál fue el momento en que supiste que estabas enamorado/a?",
        type: "text"
    },
    {
        question: "¿Qué es lo que más admiras de tu pareja?",
        type: "text"
    },
    {
        question: "¿Cuál es tu recuerdo favorito juntos?",
        type: "text"
    },
    {
        question: "Si pudieras describir tu amor en una palabra, ¿cuál sería?",
        type: "text"
    },
    {
        question: "¿Qué canción describe mejor su relación?",
        type: "text"
    },
    {
        question: "¿Cuál es tu forma favorita de demostrar amor?",
        type: "text"
    },
    {
        question: "¿Qué te hace sonreír cuando piensas en tu pareja?",
        type: "text"
    },
    {
        question: "¿Cuál es el mejor consejo que has recibido sobre el amor?",
        type: "text"
    },
    {
        question: "¿Qué es lo que hace diferente a esta relación?",
        type: "text"
    },
    {
        question: "¿Cuál es tu sueño más grande para el futuro juntos?",
        type: "text"
    }
];

// ================================================
// INICIALIZACIÓN
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    // Mostrar pantalla de carga
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 2500);

    // Inicializar contadores
    updateCounters();
    setInterval(updateCounters, 1000);

    // Inicializar navegación
    initNavigation();

    // Generar mensaje del día
    generateDailyMessage();

    // Mostrar frase de amor inicial
    generateNewQuote();

    // Inicializar observadores de scroll (GSAP se encarga ahora)
    // initScrollAnimations(); -> Reemplazado por initGsapAnimations que se auto-registra

    // Renderizar Poemas Cósmicos
    renderCosmicPoems();

    // Optimizaciones para móviles
    initMobileOptimizations();

    // Inicializar módulos (cada uno expone su init en window). La autenticación
    // bloquea la app; los datos del usuario se cargan tras iniciar sesión (loadUserData).
    if (window.AuthUI) window.AuthUI.init();
    if (window.GalleryManager) window.GalleryManager.init();
    if (window.PlaylistManager) window.PlaylistManager.init();
    if (window.TimelineManager) window.TimelineManager.init();
});

/**
 * Carga todos los datos asociados al usuario autenticado.
 * Se invoca una sola vez tras iniciar sesión correctamente.
 */
function loadUserData() {
    loadMemories();
    if (window.GalleryManager) window.GalleryManager.loadGalleryPhotos();
    if (window.TimelineManager) window.TimelineManager.loadTimelineEvents();
    loadRelationshipDate();
    if (window.PlaylistManager) window.PlaylistManager.loadPlaylist();
    loadCustomMessages();

    // Logro: Primer Login (o visita)
    setTimeout(() => {
        if (window.achievements) window.achievements.unlock('first_login');
    }, 1500);
}

async function loadRelationshipDate() {
    try {
        const savedDate = await db.getConfig('relationshipStart');
        if (savedDate) {
            relationshipStart = new Date(savedDate);
            const dateInput = document.getElementById('relationship-start');
            if (dateInput) dateInput.value = savedDate;
            calculateTimeTogether(false); // false = no guardar de nuevo
        }
    } catch (e) {
        console.error('Error cargando fecha:', e);
    }
}

// ================================================
// NAVEGACIÓN
// ================================================

function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animación suave de entrada
            if (navMenu.classList.contains('active')) {
                gsap.fromTo(navMenu.querySelectorAll('.nav-link'), 
                    { x: 50, opacity: 0 },
                    { x: 0, opacity: 1, stagger: 0.1, duration: 0.4 }
                );
            }
        });
    }

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Navegación suave y actualización de enlaces activos
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Scroll suave
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Actualizar clase activa
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Cerrar menú móvil
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Actualizar navegación al hacer scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ================================================
// CONTADORES Y ESTADÍSTICAS
// ================================================

function updateCounters() {
    const now = new Date();
    const diff = now - relationshipStart;

    // Días juntos
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const daysElement = document.getElementById('days-together');
    if (daysElement) {
        animateCounter(daysElement, days);
    }

    // Horas juntos
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const hoursElement = document.getElementById('hours-together');
    if (hoursElement) {
        animateCounter(hoursElement, hours);
    }

    // Latidos (aproximado: 70 latidos por minuto)
    const minutes = Math.floor(diff / (1000 * 60));
    const heartbeats = minutes * 70;
    const heartbeatsElement = document.getElementById('heartbeats');
    if (heartbeatsElement) {
        animateCounter(heartbeatsElement, heartbeats);
    }
}

function animateCounter(element, targetValue) {
    // Protección contra valores no numéricos
    if (isNaN(targetValue)) targetValue = 0;
    
    // Obtener valor actual limpio
    let currentText = element.textContent.replace(/,/g, '').replace(/\./g, '');
    const currentValue = parseInt(currentText) || 0;
    
    // Si la diferencia es muy grande, saltar animación para evitar lag
    if (Math.abs(targetValue - currentValue) > 1000) {
        element.textContent = targetValue.toLocaleString();
        return;
    }

    // Animación suave simple
    if (currentValue !== targetValue) {
        const step = targetValue > currentValue ? 1 : -1;
        // Solo animar si la diferencia es pequeña
        if (Math.abs(targetValue - currentValue) < 50) {
            let tempValue = currentValue;
            const interval = setInterval(() => {
                tempValue += step;
                element.textContent = tempValue.toLocaleString();
                if (tempValue === targetValue) clearInterval(interval);
            }, 50);
        } else {
            element.textContent = targetValue.toLocaleString();
        }
    }
}

function calculateTimeTogether(shouldSave = true) {
    const dateInput = document.getElementById('relationship-start');
    
    // Si no hay input o valor, intentar usar la variable global
    let startDate = relationshipStart;
    
    if (dateInput && dateInput.value) {
        startDate = new Date(dateInput.value);
        relationshipStart = startDate; // Actualizar global
        
        if (shouldSave) {
            db.setConfig('relationshipStart', dateInput.value).catch(console.error);
        }
    } else if (relationshipStart && dateInput) {
        // Rellenar input con valor guardado
        dateInput.value = relationshipStart.toISOString().split('T')[0];
    }
    
    // Validar fecha
    if (isNaN(startDate.getTime())) return;

    const resultsDiv = document.getElementById('calculator-results');
    if (resultsDiv) {
        // Logro: Love Scientist
        if (window.achievements) window.achievements.unlock('love_scientist');

        const now = new Date();
        // Diferencia absoluta para evitar negativos si la fecha es futura (improbable pero posible)
        const diff = Math.abs(now - startDate);
        
        // Cálculos precisos
        const totalSeconds = Math.floor(diff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        
        // Aproximaciones para años/meses
        const years = Math.floor(totalDays / 365.25);
        const months = Math.floor((totalDays % 365.25) / 30.44);
        const daysRemaining = Math.floor((totalDays % 365.25) % 30.44);
        
        resultsDiv.innerHTML = `
            <div class="result-item">
                <strong>📅 Tiempo Exacto:</strong> ${years} años, ${months} meses, ${daysRemaining} días
            </div>
            <div class="result-item">
                <strong>📈 Total Días:</strong> ${totalDays.toLocaleString()}
            </div>
            <div class="result-item">
                <strong>⏰ Total Horas:</strong> ${totalHours.toLocaleString()}
            </div>
            <div class="result-item">
                <strong>⏱️ Total Minutos:</strong> ${totalMinutes.toLocaleString()}
            </div>
            <div class="result-item">
                <strong>⚡ Total Segundos:</strong> ${totalSeconds.toLocaleString()}
            </div>
            <div class="result-item" style="background: rgba(255, 20, 147, 0.2); border-color: var(--primary-color); grid-column: span 2;">
                <strong>💕 Próximo Aniversario:</strong> Faltan ${365 - (totalDays % 365)} días
            </div>
        `;
        
        // Animación de entrada
        gsap.fromTo(resultsDiv.children, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, clearProps: 'all' }
        );
    }
    
    updateCounters();
}

// ================================================
// POEMAS CÓSMICOS
// ================================================

function renderCosmicPoems() {
    const container = document.getElementById('poems-container');
    if (!container) return; // Si no existe el contenedor en HTML aún, no hacer nada

    container.innerHTML = '';
    
    cosmicPoems.forEach(poem => {
        const card = document.createElement('div');
        card.className = 'poem-card';
        card.innerHTML = `
            <h3 class="poem-title">${poem.title}</h3>
            <p class="poem-content">${poem.content}</p>
        `;
        container.appendChild(card);
    });
}

// ================================================
// MODALES
// ================================================

function showLoveModal() {
    const modal = document.getElementById('love-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeLoveModal() {
    const modal = document.getElementById('love-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Cerrar modales al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ================================================
// RECUERDOS
// ================================================

async function loadMemories() {
    const memoriesList = document.getElementById('memories-list');
    if (!memoriesList) return;

    try {
        const memories = await db.getMemories();
        
        memoriesList.innerHTML = '';
        
        if (memories.length === 0) {
            memoriesList.innerHTML = '<p style="text-align: center; color: #aaa; width: 100%;">Aún no hay recuerdos guardados. ¡Empieza a escribir nuestra historia! 📖</p>';
            return;
        }

        memories.forEach((memory) => {
            // Asegurar que el ID sea correcto para Supabase o LocalStorage
            const memoryId = memory.id; 
            const idParam = typeof memoryId === 'string' ? `'${memoryId}'` : memoryId;
            
            const memoryCard = document.createElement('div');
            memoryCard.className = 'memory-card';
            memoryCard.style.cssText = `
                background: rgba(255, 255, 255, 0.05);
                padding: 1.5rem;
                border-radius: 15px;
                border: 1px solid rgba(255, 105, 180, 0.2);
                transition: transform 0.3s ease;
                margin-bottom: 1rem;
            `;
            
            // Fecha formateada
            const dateObj = new Date(memory.memory_date || memory.date);
            const dateStr = dateObj.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            memoryCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: var(--primary-color); font-size: 1.2rem;">${escapeHtml(memory.title)}</h3>
                    <span style="font-size: 1.5rem;">${memory.mood}</span>
                </div>
                <div style="font-size: 0.85rem; color: #aaa; margin-bottom: 10px;">📅 ${dateStr}</div>
                <p style="color: #ddd; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(memory.description)}</p>
                
                <div style="margin-top: 15px; text-align: right;">
                    <button class="btn-small btn-delete" onclick="deleteMemory(${idParam})" style="background: rgba(255, 0, 0, 0.2); color: #ff6b6b; border: 1px solid rgba(255, 0, 0, 0.3);">🗑️ Eliminar</button>
                </div>
            `;
            memoriesList.appendChild(memoryCard);
        });
    } catch (e) {
        console.error('Error cargando recuerdos:', e);
    }
}

// Inicialización de recuerdos
document.addEventListener('DOMContentLoaded', () => {
    // La carga inicial de recuerdos se realiza en loadUserData() tras iniciar sesión.

    const memoryForm = document.getElementById('memory-form');
    if (memoryForm) {
        memoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = document.getElementById('memory-title').value;
            const date = document.getElementById('memory-date').value;
            const description = document.getElementById('memory-description').value;
            const mood = document.getElementById('memory-mood').value;
            
            if (title && date && description && mood) {
                const btn = memoryForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = "Guardando...";
                btn.disabled = true;

                try {
                    await db.saveMemory({
                        title,
                        date, 
                        description,
                        mood
                    });
                    
                    // Logro: Memory Keeper
                    if (window.achievements) window.achievements.unlock('memory_keeper');

                    memoryForm.reset();
                    await loadMemories();
                    
                    showNotification('¡Recuerdo guardado con amor! 💕');
                } catch (e) {
                    console.error(e);
                    showNotification('Error al guardar recuerdo');
                } finally {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            }
        });
    }
});

async function deleteMemory(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este recuerdo?')) {
        try {
            await db.deleteMemory(id);
            await loadMemories();
            showNotification('Recuerdo eliminado');
        } catch (e) {
            console.error(e);
            showNotification('Error eliminando recuerdo');
        }
    }
}

// ================================================
// MENSAJES Y FRASES
// ================================================

function generateDailyMessage() {
    const messageDiv = document.getElementById('daily-message');
    if (messageDiv) {
        const randomMessage = dailyMessages[Math.floor(Math.random() * dailyMessages.length)];
        messageDiv.innerHTML = `<p>${randomMessage}</p>`;
    }
}

function generateNewQuote() {
    const quoteDisplay = document.getElementById('quote-display');
    if (quoteDisplay) {
        const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
        const quoteText = quoteDisplay.querySelector('.quote-text');
        if (quoteText) {
            gsap.to(quoteText, { opacity: 0, duration: 0.3, onComplete: () => {
                quoteText.textContent = `"${randomQuote}"`;
                gsap.to(quoteText, { opacity: 1, duration: 0.5 });
            }});
        }
    }
}

let lastMessageCount = 0;

async function loadCustomMessages(isAutoRefresh = false) {
    const container = document.getElementById('chat-container');
    if (!container) return;

    try {
        const messages = await db.getCustomMessages();
        
        // Comprobar si hay mensajes nuevos en el auto-refresh
        if (isAutoRefresh && messages.length > lastMessageCount) {
            // Reproducir sonido de notificación
            playNotificationSound();
            
            // Si la pestaña no está activa o el usuario no está viendo el chat
            if (document.hidden) {
                if (Notification.permission === "granted") {
                    new Notification("Nuevo mensaje en Love Galaxy 💌", {
                        body: "¡Tienes un nuevo mensaje de amor!",
                        icon: "https://cdn.pixabay.com/photo/2018/02/12/10/45/heart-3147976_1280.jpg"
                    });
                }
            } else {
                // Notificación visual en la app
                showNotification("¡Nuevo mensaje recibido! 💌");
            }
        }
        
        // Actualizar el contador
        lastMessageCount = messages.length;
        
        container.innerHTML = '';
        if (messages.length === 0) {
            container.innerHTML = `
                <div class="chat-placeholder">
                    <span style="font-size: 2rem;">💌</span>
                    <p>Escribe el primer mensaje...</p>
                </div>
            `;
            return;
        }

        messages.forEach(msg => {
            const msgEl = document.createElement('div');
            // Detectar remitente por el contenido "Nombre: Mensaje"
            let senderClass = 'sender-cris'; // Default
            let content = msg.content;
            let senderName = 'Cris';

            if (content.startsWith('Tamara:')) {
                senderClass = 'sender-tamara';
                content = content.replace('Tamara:', '').trim();
                senderName = 'Tamara';
            } else if (content.startsWith('Cris:')) {
                senderClass = 'sender-cris';
                content = content.replace('Cris:', '').trim();
                senderName = 'Cris';
            }

            msgEl.className = `chat-message ${senderClass}`;
            
            // Formatear fecha
            const date = new Date(msg.created_at);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString();

            msgEl.innerHTML = `
                <div class="message-text">${escapeHtml(content)}</div>
                <div class="chat-message-meta">
                    <span>${senderName}</span>
                    <span>${timeStr} ${dateStr}</span>
                </div>
            `;
            container.appendChild(msgEl);
        });

        // Scroll al final solo si no es un refresh automático o si ya estaba al final
        if (!isAutoRefresh || (container.scrollHeight - container.scrollTop <= container.clientHeight + 100)) {
            container.scrollTop = container.scrollHeight;
        }

    } catch (e) {
        console.error("Error cargando mensajes:", e);
    }
}

// Función para reproducir sonido de notificación
function playNotificationSound() {
    try {
        // Usar la API de AudioContext para generar un sonido de "burbuja" o "pop"
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // Nota La
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // Sube una octava rápido
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05); // Fade in
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3); // Fade out
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        console.log("No se pudo reproducir sonido de notificación", e);
    }
}

// Solicitar permiso de notificaciones push
document.addEventListener('DOMContentLoaded', () => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
});

async function sendChatMessage() {
    const input = document.getElementById('custom-message-text');
    const senderSelect = document.getElementById('chat-sender');
    
    if (input && input.value.trim() && senderSelect) {
        const text = input.value.trim();
        const sender = senderSelect.value;
        const fullMessage = `${sender}: ${text}`;

        const btn = document.querySelector('.btn-send');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '⏳';
        btn.disabled = true;

        try {
            await db.saveCustomMessage(fullMessage);
            
            // Logro: Poet
            if (window.achievements) window.achievements.unlock('poet');

            input.value = '';
            await loadCustomMessages(); // Recargar chat
            
        } catch (e) {
            console.error(e);
            showNotification('Error al enviar mensaje');
        } finally {
            btn.innerHTML = originalContent;
            btn.disabled = false;
            input.focus();
        }
    }
}

// Auto-refresh chat cada 10 segundos (solo con sesión activa)
setInterval(() => {
    if (window.__authenticated) loadCustomMessages(true);
}, 10000);

// Enter para enviar
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('custom-message-text');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

// Alias para compatibilidad con botones antiguos si quedan
const saveCustomMessage = sendChatMessage;

// Nota: la carga inicial del chat se realiza en loadUserData() tras iniciar sesión.

// ================================================
// ANIMACIONES GSAP
// ================================================

function initGsapAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    const heroTl = gsap.timeline();
    heroTl.from('.hero h1', { y: 50, opacity: 0, duration: 1, ease: "back.out(1.7)" })
          .from('.hero p', { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
          .from('.hero-buttons', { scale: 0.8, opacity: 0, duration: 0.5 }, "-=0.3");

    // Sections ScrollTrigger
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Timeline Items Stagger
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: "top 85%"
            }
        });
    });

    // Floating Elements (Hearts/Stars background if any)
    gsap.to('.floating-element', {
        y: -20,
        rotation: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
    });
}

// Reemplazar initScrollAnimations con GSAP
// initScrollAnimations se llamaba en DOMContentLoaded, ahora llamaremos initGsapAnimations
document.addEventListener('DOMContentLoaded', initGsapAnimations);

// ================================================
// ANIMACIONES DE SCROLL (LEGACY - REEMPLAZADO POR GSAP)
// ================================================

/*
function initScrollAnimations() {
   // Reemplazado por GSAP en initGsapAnimations
}
*/

// ================================================
// NOTIFICACIONES
// ================================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(255, 20, 147, 0.5);
        z-index: 10001;
        animation: slideInRight 0.5s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ================================================
// UTILIDADES
// ================================================

// Generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Formatear fecha
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Escapar HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ================================================
// OPTIMIZACIONES PARA MÓVILES
// ================================================

function initMobileOptimizations() {
    // Detect if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('is-mobile');
        
        // Optimizar scroll
        adjustScrollBehavior();
        
        // Mejorar controles táctiles
        enhanceTouchControls();
        
        // Reducir efectos en móviles
        optimizeEffectsForMobile();
    }
    
    // Detectar orientación
    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
}

function adjustScrollBehavior() {
    // Suavizar scroll en móviles
    document.documentElement.style.scrollBehavior = 'smooth';
}

function enhanceTouchControls() {
    // Agregar clases touch a botones
    document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-game, .nav-link').forEach(el => {
        el.classList.add('touch-friendly');
    });
    
    // Mejorar área de toque para elementos pequeños
    document.querySelectorAll('.btn-small, .filter-btn').forEach(el => {
        el.style.minHeight = '44px'; // Tamaño mínimo recomendado para touch
        el.style.minWidth = '44px';
    });
}

function optimizeEffectsForMobile() {
    // Reducir número de partículas en móviles
    const canvasHearts = document.getElementById('hearts-canvas');
    const canvasStars = document.getElementById('stars-canvas');
    
    if (canvasHearts && window.particleSystem) {
        // Reducir partículas a la mitad en móviles
        if (window.innerWidth < 768) {
            window.particleSystem.maxParticles = Math.floor(window.particleSystem.maxParticles / 2);
        }
    }
}

function handleOrientationChange() {
    const isLandscape = window.innerWidth > window.innerHeight;
    
    if (isLandscape) {
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
    } else {
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
    }
    
    // Ajustar viewport mobile
    if (window.innerWidth < 768) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

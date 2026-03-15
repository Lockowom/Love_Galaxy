// ================================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ================================================

// Fecha de inicio de la relación (se cargará de la DB)
let relationshipStart = new Date('2024-01-01');

// Estado de la música
let isPlaying = false;
let currentSongIndex = 0;

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

    // Cargar recuerdos guardados
    loadMemories();
    
    // Cargar fotos de la galería
    loadGalleryPhotos();
    
    // Cargar eventos del timeline
    loadTimelineEvents();

    // Generar mensaje del día
    generateDailyMessage();

    // Mostrar frase de amor inicial
    generateNewQuote();

    // Inicializar observadores de scroll (GSAP se encarga ahora)
    // initScrollAnimations(); -> Reemplazado por initGsapAnimations que se auto-registra


    // Cargar fecha de relación
    loadRelationshipDate();
    
    // Renderizar Poemas Cósmicos
    renderCosmicPoems();

    // Optimizaciones para móviles
    initMobileOptimizations();
    
    // Cargar Playlist (esto faltaba)
    loadPlaylist();

    // Logro: Primer Login (o visita)
    setTimeout(() => {
        if (window.achievements) window.achievements.unlock('first_login');
    }, 3000);
});

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

// ================================================
// TIMELINE
// ================================================

function addMemory(type) {
    const memories = {
        'encuentro': 'Cuéntame más sobre nuestro primer encuentro...',
        'conversacion': '¿Qué recuerdas de nuestra primera conversación?',
        'te-amo': '¿Cómo te sentiste cuando escuchaste mi "te amo"?',
        'especial': 'Describe ese momento especial...',
        'futuro': '¿Qué sueñas para nuestro futuro?'
    };
    
    const message = memories[type] || '¿Qué te gustaría agregar?';
    const detail = prompt(message);
    
    if (detail) {
        // Guardar recuerdo rápido (se podría mejorar para usar db)
        // Por ahora lo guardamos como un evento de timeline genérico si es necesario
        // Pero la función original solo mostraba un alert. 
        // Vamos a mantener el comportamiento original pero guardar en DB si se desea.
        alert('¡Recuerdo guardado! 💕\n\n' + detail);
        
        // Opcional: Guardar como evento
        /*
        db.saveTimelineEvent({
            title: 'Recuerdo Especial',
            date: new Date().toLocaleDateString(),
            description: detail,
            icon: '💕'
        });
        */
    }
}

function openTimelineEditor() {
    alert('¡Función de edición de timeline! 📝\n\nAquí podrás personalizar completamente la historia de tu amor. Próximamente con más funciones interactivas.');
}

// ================================================
// GALERÍA
// ================================================

// Filtros de galería
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            const galleryItems = document.querySelectorAll('.gallery-item');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

// Modales de Fotos
function openPhotoUploadModal() {
    const modal = document.getElementById('photo-upload-modal');
    if(modal) modal.classList.add('active');
}

function closePhotoUploadModal() {
    const modal = document.getElementById('photo-upload-modal');
    if(modal) {
        modal.classList.remove('active');
        // Reset form
        document.getElementById('photo-upload-form').reset();
        document.getElementById('photo-preview-container').style.display = 'none';
    }
}

function handlePhotoSelect(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById('photo-preview');
            const container = document.getElementById('photo-preview-container');
            preview.src = e.target.result;
            container.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    }
}

// Cargar Fotos
async function loadGalleryPhotos() {
    const gridContainer = document.getElementById('gallery-grid-container');
    if (!gridContainer) return;

    try {
        const photos = await db.getPhotos();
        
        gridContainer.innerHTML = ''; // Limpiar
        
        if (photos.length === 0) {
            gridContainer.innerHTML = `
                <div class="gallery-placeholder-empty" style="grid-column: 1/-1; text-align: center; padding: 3rem; background: rgba(255,255,255,0.05); border-radius: 20px;">
                    <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">📸</span>
                    <p>La galería está vacía. ¡Sube nuestra primera foto!</p>
                </div>
            `;
            return;
        }

        photos.forEach(photo => {
            const imageUrl = photo.url || photo.dataUrl;
            const item = document.createElement('div');
            item.className = 'gallery-item has-photo';
            item.setAttribute('data-category', photo.category || 'juntos');
            item.setAttribute('data-photo-id', photo.id);
            
            // Animación de entrada
            item.style.animation = 'fadeIn 0.5s ease forwards';
            
            const deleteBtn = `
                <button onclick="deletePhoto('${photo.id}')" class="btn-delete-photo" style="position: absolute; top: 10px; right: 10px; background: rgba(255,0,0,0.6); border: none; border-radius: 50%; width: 30px; height: 30px; color: white; cursor: pointer; opacity: 0; transition: opacity 0.3s;">🗑️</button>
            `;

            item.innerHTML = `
                <div class="gallery-placeholder has-photo" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div>
                <div class="gallery-overlay">
                    <h4>${escapeHtml(photo.caption || getCategoryName(photo.category))}</h4>
                    <p style="font-size: 0.8rem; opacity: 0.8;">${new Date(photo.created_at || Date.now()).toLocaleDateString()}</p>
                    ${deleteBtn}
                </div>
            `;
            
            // Mostrar botón borrar al hover
            item.addEventListener('mouseenter', () => {
                const btn = item.querySelector('.btn-delete-photo');
                if(btn) btn.style.opacity = '1';
            });
            item.addEventListener('mouseleave', () => {
                const btn = item.querySelector('.btn-delete-photo');
                if(btn) btn.style.opacity = '0';
            });

            gridContainer.appendChild(item);
        });

        // Inicializar Dome Gallery si existe
        if (window.initDomeGallery) {
            window.initDomeGallery(photos);
        }

    } catch (e) {
        console.error('Error cargando fotos:', e);
        gridContainer.innerHTML = '<p class="text-center text-error">Error al cargar la galería</p>';
    }
}

function getCategoryName(cat) {
    const names = {
        'juntos': 'Juntos',
        'viajes': 'Viajes',
        'celebraciones': 'Celebraciones',
        'especiales': 'Especiales'
    };
    return names[cat] || 'Recuerdo';
}

async function deletePhoto(id) {
    if(confirm("¿Quieres borrar esta foto de la galería?")) {
        try {
            await db.deletePhoto(id);
            await loadGalleryPhotos();
            showNotification("Foto eliminada 🗑️");
        } catch(e) {
            console.error(e);
            showNotification("Error al eliminar");
        }
    }
}

// Event Listener para el formulario
document.addEventListener('DOMContentLoaded', () => {
    const photoForm = document.getElementById('photo-upload-form');
    if (photoForm) {
        photoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fileInput = document.getElementById('gallery-photo-input');
            const category = document.getElementById('photo-category').value;
            const caption = document.getElementById('photo-caption').value;

            if (!fileInput.files || !fileInput.files[0]) {
                showNotification("¡Debes elegir una foto!");
                return;
            }

            const btn = photoForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = "Subiendo... ⏳";
            btn.disabled = true;

            try {
                await db.savePhoto({
                    file: fileInput.files[0],
                    category,
                    caption
                });
                
                // Logro
                if (window.achievements) window.achievements.unlock('photographer');

                closePhotoUploadModal();
                showNotification("¡Foto guardada en la galaxia! 🌌");
                await loadGalleryPhotos();

            } catch (e) {
                console.error(e);
                showNotification("Error al subir la foto ❌");
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }
    
    // Cargar fotos al inicio
    loadGalleryPhotos();
});

// Función antigua (legacy) por si acaso
function uploadPhoto(button) {
    openPhotoUploadModal();
}

    // Convertir ID a string seguro
    const idParam = typeof photoId === 'string' ? `'${photoId}'` : photoId;
    
    overlay.innerHTML = `
        <button onclick="viewPhotoFullscreen(${idParam})" class="btn-small btn-view">👁️ Ver</button>
        <button onclick="changePhoto(this)" class="btn-small btn-change">🔄 Cambiar</button>
        <button onclick="deletePhoto(${idParam}, this)" class="btn-small btn-delete">🗑️ Eliminar</button>
    `;
}

function changePhoto(button) {
    uploadPhoto(button);
}

async function deletePhoto(photoId, button) {
    if (!confirm('¿Estás seguro de eliminar esta foto?')) return;
    
    try {
        await db.deletePhoto(photoId);
        
        const galleryItem = button.closest('.gallery-item');
        const placeholder = galleryItem.querySelector('.gallery-placeholder');
        const category = galleryItem.getAttribute('data-category');
        
        placeholder.style.backgroundImage = '';
        placeholder.classList.remove('has-photo');
        galleryItem.classList.remove('has-photo');
        galleryItem.removeAttribute('data-photo-id');
        
        // Restaurar placeholder original
        const icons = {
            'juntos': '📷',
            'especiales': '💕',
            'viajes': '✈️',
            'celebraciones': '🎉'
        };
        
        placeholder.innerHTML = `
            <span class="placeholder-icon">${icons[category] || '📸'}</span>
            <p>Añade una foto especial</p>
        `;
        
        const overlay = galleryItem.querySelector('.gallery-overlay');
        overlay.innerHTML = `
            <h4>Subir Foto</h4>
            <button onclick="uploadPhoto(this)" class="btn-small">Subir Foto</button>
        `;
        
        showToast('🗑️ Foto eliminada', 'info');
    } catch (e) {
        console.error(e);
        showToast('❌ Error al eliminar foto', 'error');
    }
}

async function viewPhotoFullscreen(photoId) {
    const photos = await db.getPhotos();
    const photo = photos.find(p => p.id === photoId) || photos[photoId];
    
    if (!photo) return;
    
    const imageUrl = photo.url || photo.dataUrl;
    
    // Crear modal de vista completa
    const modal = document.createElement('div');
    modal.className = 'photo-fullscreen-modal';
    modal.innerHTML = `
        <div class="photo-fullscreen-content">
            <button class="photo-close" onclick="this.closest('.photo-fullscreen-modal').remove()">&times;</button>
            <img src="${imageUrl}" alt="Foto" />
            <div class="photo-info">
                <p>📅 ${new Date(photo.date || photo.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>📁 ${getCategoryName(photo.category)}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar con click fuera de la imagen
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Cerrar con ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function getCategoryName(category) {
    const names = {
        'juntos': 'Juntos 💑',
        'especiales': 'Especiales 💝',
        'viajes': 'Viajes ✈️',
        'celebraciones': 'Celebraciones 🎉'
    };
    return names[category] || category;
}

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
    loadMemories(); // Cargar al inicio

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

// Auto-refresh chat cada 10 segundos
setInterval(() => loadCustomMessages(true), 10000);

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

// Cargar mensajes al inicio
document.addEventListener('DOMContentLoaded', loadCustomMessages);

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
// MÚSICA Y PLAYLIST (CON SOPORTE YOUTUBE)
// ================================================

let playlist = [];
let audioPlayer = null; // Instancia global del reproductor HTML5
let youtubePlayer = null; // Instancia global del reproductor YouTube
let isYouTubeReady = false;

// Inicialización de la API de YouTube
window.onYouTubeIframeAPIReady = function() {
    youtubePlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
};

function onPlayerReady(event) {
    isYouTubeReady = true;
    console.log("✅ YouTube Player Ready");
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayerUI(currentSongIndex);
        startYouTubeProgressLoop();
        
        // Activar visualizador (simulado para YT)
        if (window.galaxyVisualizer) {
            window.galaxyVisualizer.simulate(true);
        }
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayerUI(currentSongIndex);
        stopYouTubeProgressLoop();
        
        if (window.galaxyVisualizer) {
            window.galaxyVisualizer.simulate(false);
        }
    } else if (event.data === YT.PlayerState.ENDED) {
        stopYouTubeProgressLoop();
        nextSong();
    }
}

function onPlayerError(event) {
    console.error("Error YouTube:", event.data);
    showNotification("❌ Error al reproducir video de YouTube (posible restricción)");
    nextSong();
}

let ytProgressInterval;
function startYouTubeProgressLoop() {
    stopYouTubeProgressLoop();
    ytProgressInterval = setInterval(() => {
        if (youtubePlayer && youtubePlayer.getCurrentTime) {
            const currentTime = youtubePlayer.getCurrentTime();
            const duration = youtubePlayer.getDuration();
            updateProgressBarUI(currentTime, duration);
        }
    }, 1000);
}

function stopYouTubeProgressLoop() {
    if (ytProgressInterval) clearInterval(ytProgressInterval);
}

// ... Resto de funciones ...

async function loadPlaylist() {
    try {
        const songs = await db.getPlaylist();
        
        // Canciones por defecto
        const defaultSongs = [
            { 
                title: "Love Story", 
                artist: "Musica Romántica", 
                url: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc06222727.mp3?filename=piano-moment-11938.mp3" 
            },
            { 
                title: "Sweet Memories", 
                artist: "Piano Suave", 
                url: "https://cdn.pixabay.com/download/audio/2022/05/05/audio_13b632669e.mp3?filename=soft-piano-109677.mp3" 
            }
        ];

        playlist = songs.length > 0 ? songs : defaultSongs;
        
        if (songs.length === 0 && !window.supabaseClient) {
             playlist = defaultSongs;
        }
        
        renderPlaylist();
        if (!audioPlayer) initAudioPlayer();
        if (playlist.length > 0) updatePlayerUI(currentSongIndex, false);
        
    } catch (e) {
        console.error("Error cargando playlist:", e);
    }
}

function initAudioPlayer() {
    audioPlayer = document.getElementById('bg-music');
    if (!audioPlayer) {
        audioPlayer = new Audio(); // Fallback si no está en HTML
        audioPlayer.id = 'bg-music';
        document.body.appendChild(audioPlayer);
    }
    audioPlayer.crossOrigin = "anonymous";

    audioPlayer.addEventListener('play', () => {
        if (window.galaxyVisualizer) {
            window.galaxyVisualizer.resume();
            window.galaxyVisualizer.connect(audioPlayer);
            window.galaxyVisualizer.simulate(false); // Usar real
        }
        isPlaying = true;
        updatePlayerUI(currentSongIndex);
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayerUI(currentSongIndex);
    });

    audioPlayer.addEventListener('ended', nextSong);
    
    audioPlayer.addEventListener('waiting', () => {
        const playBtn = document.getElementById('play-btn');
        if(playBtn) playBtn.textContent = '⏳';
    });

    audioPlayer.addEventListener('canplay', () => {
        const playBtn = document.getElementById('play-btn');
        if(playBtn) playBtn.textContent = isPlaying ? '⏸️' : '▶️';
    });

    audioPlayer.addEventListener('timeupdate', () => {
        updateProgressBarUI(audioPlayer.currentTime, audioPlayer.duration);
    });
    
    audioPlayer.addEventListener('error', (e) => {
        console.error("Error audio HTML5:", e);
        const playBtn = document.getElementById('play-btn');
        if(playBtn) playBtn.textContent = '❌';
        
        if (isPlaying) {
             showNotification("❌ Error de audio. Saltando...");
             setTimeout(nextSong, 2000);
        }
    });

    // Input Range Event
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.addEventListener('input', function() {
            const currentSong = playlist[currentSongIndex];
            const isYT = isYouTubeUrl(currentSong.url);
            
            if (isYT && youtubePlayer) {
                const duration = youtubePlayer.getDuration();
                const seekTime = (duration / 100) * this.value;
                youtubePlayer.seekTo(seekTime, true);
            } else if (audioPlayer && audioPlayer.duration) {
                const seekTime = (audioPlayer.duration / 100) * this.value;
                audioPlayer.currentTime = seekTime;
            }
        });
    }
}

function isYouTubeUrl(url) {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function setSong(index) {
    if (index < 0 || index >= playlist.length) return;
    
    // Detener lo que esté sonando antes
    if (audioPlayer) audioPlayer.pause();
    if (youtubePlayer && isYouTubeReady) youtubePlayer.stopVideo();
    
    currentSongIndex = index;
    const song = playlist[index];
    const isYT = isYouTubeUrl(song.url);
    
    console.log(`Reproduciendo: ${song.title} (${isYT ? 'YouTube' : 'Audio'})`);

    if (isYT) {
        const videoId = getYouTubeId(song.url);
        if (videoId && isYouTubeReady) {
            youtubePlayer.loadVideoById(videoId);
            isPlaying = true;
        } else {
            showNotification("⚠️ Reproductor de YouTube no listo o URL inválida");
        }
    } else {
        // Audio Normal
        // Intentar recuperar si hubo error previo
        if (audioPlayer.error) {
            console.log("Recreando audio player por error previo");
            audioPlayer.load();
        }

        audioPlayer.src = song.url;
        
        // Manejo de promesa de Play
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Reproducción iniciada correctamente
                isPlaying = true;
                updatePlayerUI(index);
                
                // Conectar visualizador si es posible
                if (window.galaxyVisualizer) {
                    try {
                        window.galaxyVisualizer.connect(audioPlayer);
                        window.galaxyVisualizer.simulate(false);
                    } catch(e) {
                        console.warn("No se pudo conectar visualizador (posible error CORS):", e);
                        window.galaxyVisualizer.simulate(true); // Fallback a simulación
                    }
                }
            })
            .catch(error => {
                console.error("Error al reproducir audio:", error);
                
                // Si es error de interacción (Autoplay Policy)
                if (error.name === 'NotAllowedError') {
                    showNotification("⚠️ Pulsa Play para escuchar la canción");
                    isPlaying = false;
                    updatePlayerUI(index);
                } 
                // Si es error de carga/formato
                else {
                    showNotification("❌ Error cargando canción. Verifica el formato.");
                }
            });
        }
    }
    
    updatePlayerUI(index);
}

function togglePlay() {
    const song = playlist[currentSongIndex];
    if (!song) return; // Protección si playlist está vacía

    const isYT = isYouTubeUrl(song.url);

    if (isPlaying) {
        if (isYT && youtubePlayer && isYouTubeReady) youtubePlayer.pauseVideo();
        else if (audioPlayer) audioPlayer.pause();
        isPlaying = false;
    } else {
        if (isYT && youtubePlayer && isYouTubeReady) youtubePlayer.playVideo();
        else if (audioPlayer) {
            // Si no tiene fuente o es inválida, cargar la canción actual
            if (!audioPlayer.src || audioPlayer.src === window.location.href || audioPlayer.src === '') {
                setSong(currentSongIndex);
            } else {
                audioPlayer.play().catch(e => {
                    console.error("Error al reanudar:", e);
                    setSong(currentSongIndex); // Reintentar carga completa
                });
            }
        }
        isPlaying = true;
    }
    updatePlayerUI(currentSongIndex);
}

function updatePlayerUI(index, updateAudio = true) {
    const playBtn = document.getElementById('play-btn');
    const vinyl = document.querySelector('.vinyl-record');
    const titleElement = document.getElementById('current-song');
    const artistElement = document.getElementById('current-artist');
    
    if (playlist[index]) {
        if (titleElement) titleElement.textContent = playlist[index].title;
        if (artistElement) artistElement.textContent = playlist[index].artist || 'Desconocido';
    }

    if (playBtn) playBtn.textContent = isPlaying ? '⏸️' : '▶️';
    
    if (vinyl) {
        if (isPlaying) vinyl.classList.add('playing');
        else vinyl.classList.remove('playing');
    }
    
    renderPlaylist();
}

function updateProgressBarUI(currentTime, duration) {
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    
    if (progressBar && duration > 0) {
        const value = (currentTime / duration) * 100;
        progressBar.value = value;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
        if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
    }
}

// ... Resto de funciones playlist (nextSong, prevSong, deleteSong) igual ...
// (Solo asegúrate de copiarlas si no están arriba)

function nextSong() {
    let nextIndex = (currentSongIndex + 1) % playlist.length;
    setSong(nextIndex);
}

function previousSong() {
    let prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    setSong(prevIndex);
}

function renderPlaylist() {
    const container = document.getElementById('playlist-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${index === currentSongIndex ? 'active' : ''}`;
        
        const isDefault = !song.id || (typeof song.id === 'number' && song.id < 1000);
        const isYT = isYouTubeUrl(song.url);
        
        item.innerHTML = `
            <span class="song-number">${index + 1}</span>
            <div class="song-info">
                <h4>${escapeHtml(song.title)} ${isYT ? '📺' : ''}</h4>
                <p>${escapeHtml(song.artist || 'Desconocido')}</p>
            </div>
            <div class="song-actions" style="display: flex; gap: 5px;">
                <button class="btn-small" onclick="setSong(${index})">
                    ${index === currentSongIndex && isPlaying ? '⏸️' : '▶️'}
                </button>
                ${!isDefault ? `<button class="btn-small btn-delete" onclick="deleteSong(${index})" title="Eliminar">🗑️</button>` : ''}
            </div>
        `;
        container.appendChild(item);
    });
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Modal de Subida y Tabs
function openSongUploadModal() {
    const modal = document.getElementById('song-upload-modal');
    if (modal) modal.classList.add('active');
}

function closeSongUploadModal() {
    const modal = document.getElementById('song-upload-modal');
    if (modal) modal.classList.remove('active');
}

function switchSongTab(tab) {
    // Actualizar botones
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active'); // event is global in inline onclick, but risky. better use event delegation or passed this.
    // Actually, in inline onclick 'this' is not the button if not passed. 
    // Let's fix the logic below in initialization to be safer.
}

// Manejo de formulario de subida
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic safe implementation
    window.switchSongTab = function(tabName) {
        // Buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.id === `tab-btn-${tabName}`) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeTab = document.getElementById(`tab-${tabName}`);
        if(activeTab) activeTab.classList.add('active');
        
        // Set hidden input or state to know which type
        const form = document.getElementById('song-upload-form');
        if(form) form.dataset.type = tabName; // 'upload', 'youtube', 'url'
    };

    // YouTube Preview Logic
    const ytUrlInput = document.getElementById('youtube-url');
    if (ytUrlInput) {
        ytUrlInput.addEventListener('input', function() {
            const url = this.value;
            const videoId = getYouTubeId(url);
            const previewDiv = document.getElementById('youtube-preview');
            const thumbImg = document.getElementById('youtube-thumbnail');
            const titlePreview = document.getElementById('youtube-title-preview');

            if (videoId) {
                previewDiv.style.display = 'block';
                thumbImg.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                titlePreview.textContent = "✅ Video detectado";
                
                // Auto-fill title if empty (optional, requires API, skipping for now to keep simple)
            } else {
                previewDiv.style.display = 'none';
            }
        });
    }

    const songForm = document.getElementById('song-upload-form');
    const fileInput = document.getElementById('song-file');
    const fileNameDisplay = document.getElementById('file-name-display');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                const file = e.target.files[0];
                fileNameDisplay.textContent = `✅ ${file.name}`;
                // Auto-fill title from filename
                const titleInput = document.getElementById('song-title');
                if (titleInput && !titleInput.value) {
                    titleInput.value = file.name.replace(/\.[^/.]+$/, "");
                }
            }
        });
    }

    if (songForm) {
        // Default type
        if(!songForm.dataset.type) songForm.dataset.type = 'upload';

        songForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = document.getElementById('song-title').value;
            const artist = document.getElementById('song-artist').value;
            let type = songForm.dataset.type || 'upload';
            
            // Mapeo de tipos para db.js
            // 'upload' -> 'file'
            // 'url' -> 'url'
            // 'youtube' -> 'url' (pero con validación especial)
            
            let songData = { title, artist };

            if (type === 'upload') {
                songData.type = 'file';
                const fileInput = document.getElementById('song-file');
                if (!fileInput.files || !fileInput.files[0]) {
                    showNotification("Por favor selecciona un archivo de audio");
                    // Intentar abrir el selector si no hay archivo
                    fileInput.click();
                    return;
                }
                songData.file = fileInput.files[0];
            } else if (type === 'youtube') {
                songData.type = 'url';
                const url = document.getElementById('youtube-url').value;
                if (!url || !getYouTubeId(url)) {
                    showNotification("Por favor ingresa un enlace de YouTube válido");
                    return;
                }
                songData.url = url;
            } else {
                songData.type = 'url';
                const url = document.getElementById('song-url').value;
                if (!url) {
                    showNotification("Por favor ingresa una URL válida");
                    return;
                }
                if (url.includes('spotify.com')) {
                    alert("⚠️ Los enlaces de Spotify no son compatibles. Usa enlaces de YouTube o archivos directos.");
                    return;
                }
                songData.url = url;
            }

            // Mostrar estado de carga
            const submitBtn = songForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "⏳ Guardando...";
            submitBtn.disabled = true;

            try {
                await db.saveSong(songData);
                showNotification("¡Canción agregada exitosamente! 🎵");
                
                // Logro: DJ Love
                if (window.achievements) window.achievements.unlock('dj_love');

                // Reset form
                songForm.reset();
                if(fileNameDisplay) fileNameDisplay.textContent = "Ningún archivo seleccionado";
                if(document.getElementById('youtube-preview')) document.getElementById('youtube-preview').style.display = 'none';
                
                closeSongUploadModal();
                await loadPlaylist();
            } catch (error) {
                console.error("Detalle del error:", error);
                
                let errorMsg = "Error al guardar la canción ❌";
                if (error.message) {
                    if (error.message.includes("violates row-level security")) {
                        errorMsg = "❌ Error de Permisos: Ejecuta el script SQL en Supabase.";
                    } else if (error.message.includes("The resource was not found")) {
                        errorMsg = "❌ Error: No se encontró el Bucket 'love_songs' en Supabase.";
                    } else {
                        errorMsg = `❌ Error: ${error.message}`;
                    }
                }
                
                showNotification(errorMsg);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Cargar playlist al inicio
    loadPlaylist();
});

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
// TIMELINE EDITABLE
// ================================================

async function loadTimelineEvents() {
    const timelineContainer = document.querySelector('.timeline');
    if (!timelineContainer) return;
    
    try {
        const savedEvents = await db.getTimelineEvents();
        
        // Si hay eventos guardados, reemplazar los del HTML
        if (savedEvents.length > 0) {
            // Mantener el botón de agregar evento
            const addButton = timelineContainer.querySelector('.timeline-add-btn');
            timelineContainer.innerHTML = '';
            
            savedEvents.forEach((event, index) => {
                // Usar ID del evento si existe, sino el índice (para compatibilidad)
                const eventId = event.id || index;
                const timelineItem = createTimelineItem(event, eventId);
                timelineContainer.appendChild(timelineItem);
            });
            
            // Re-agregar botón si existía
            if (addButton) {
                timelineContainer.appendChild(addButton);
            } else {
                addTimelineButton(timelineContainer);
            }
        } else {
            // Agregar botón de añadir evento si no existe
            if (!timelineContainer.querySelector('.timeline-add-btn')) {
                addTimelineButton(timelineContainer);
            }
        }
    } catch (e) {
        console.error('Error cargando timeline:', e);
    }
}

function createTimelineItem(event, id) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    // Si el ID es string (UUID), ponerlo entre comillas simples en las llamadas onclick
    const idParam = typeof id === 'string' ? `'${id}'` : id;
    item.setAttribute('data-event-id', id);
    
    // Formatear fecha si viene de DB
    let dateDisplay = event.date || event.date_str;
    
    item.innerHTML = `
        <div class="timeline-content">
            <div class="timeline-icon">${event.icon || '💕'}</div>
            <h3>${escapeHtml(event.title)}</h3>
            <p class="timeline-date">${escapeHtml(dateDisplay)}</p>
            <p>${escapeHtml(event.description)}</p>
            <div class="timeline-actions">
                <button onclick="editTimelineEvent(${idParam})" class="btn-small">✏️ Editar</button>
                <button onclick="deleteTimelineEvent(${idParam})" class="btn-small">🗑️ Eliminar</button>
            </div>
        </div>
    `;
    
    return item;
}

function addTimelineButton(container) {
    const addBtn = document.createElement('div');
    addBtn.className = 'timeline-item timeline-add-btn';
    addBtn.innerHTML = `
        <div class="timeline-content add-event-content">
            <div class="timeline-icon">➕</div>
            <h3>Agregar Evento</h3>
            <p>Añade un momento especial a tu historia</p>
            <button onclick="showAddEventModal()" class="btn-primary">Agregar Evento</button>
        </div>
    `;
    container.appendChild(addBtn);
}

function showAddEventModal() {
    const modal = document.createElement('div');
    modal.className = 'modal timeline-modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>✨ Agregar Evento a Nuestra Historia</h2>
            <form id="timeline-event-form">
                <div class="form-group">
                    <label>Título del Evento</label>
                    <input type="text" id="event-title" required placeholder="Ej: Nuestro Primer Beso">
                </div>
                <div class="form-group">
                    <label>Fecha</label>
                    <input type="text" id="event-date" required placeholder="Ej: Enero 2024">
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="event-description" required rows="4" placeholder="Describe este momento especial..."></textarea>
                </div>
                <div class="form-group">
                    <label>Icono (Emoji)</label>
                    <input type="text" id="event-icon" maxlength="2" placeholder="💕">
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="btn-primary">💾 Guardar Evento</button>
                    <button type="button" onclick="this.closest('.modal').remove()" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const form = modal.querySelector('#timeline-event-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const event = {
            title: document.getElementById('event-title').value,
            date_str: document.getElementById('event-date').value, // Supabase field
            date: document.getElementById('event-date').value,     // LocalStorage compat
            description: document.getElementById('event-description').value,
            icon: document.getElementById('event-icon').value || '💕'
        };
        
        try {
            await db.saveTimelineEvent(event);
            
            modal.remove();
            await loadTimelineEvents();
            showToast('✅ Evento agregado a tu historia', 'success');
        } catch (error) {
            console.error(error);
            showToast('❌ Error al guardar evento', 'error');
        }
    });
}

async function editTimelineEvent(id) {
    try {
        const events = await db.getTimelineEvents();
        let event = null;
        
        // Buscar evento por ID o índice
        if (typeof id === 'string') { // Supabase UUID
            event = events.find(e => e.id === id);
        } else { // LocalStorage index
            event = events[id];
        }
        
        if (!event) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal timeline-modal active';
        
        const dateValue = event.date_str || event.date;
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2>✏️ Editar Evento</h2>
                <form id="edit-timeline-form">
                    <div class="form-group">
                        <label>Título del Evento</label>
                        <input type="text" id="edit-event-title" required value="${escapeHtml(event.title)}">
                    </div>
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="text" id="edit-event-date" required value="${escapeHtml(dateValue)}">
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="edit-event-description" required rows="4">${escapeHtml(event.description)}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Icono (Emoji)</label>
                        <input type="text" id="edit-event-icon" maxlength="2" value="${event.icon || '💕'}">
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="btn-primary">💾 Guardar Cambios</button>
                        <button type="button" onclick="this.closest('.modal').remove()" class="btn-secondary">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = modal.querySelector('#edit-timeline-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedEvent = {
                title: document.getElementById('edit-event-title').value,
                date_str: document.getElementById('edit-event-date').value,
                date: document.getElementById('edit-event-date').value,
                description: document.getElementById('edit-event-description').value,
                icon: document.getElementById('edit-event-icon').value || '💕'
            };
            
            try {
                await db.updateTimelineEvent(id, updatedEvent);
                
                modal.remove();
                await loadTimelineEvents();
                showToast('✅ Evento actualizado', 'success');
            } catch (error) {
                console.error(error);
                showToast('❌ Error al actualizar', 'error');
            }
        });
    } catch (e) {
        console.error('Error editando evento:', e);
    }
}

async function deleteTimelineEvent(id) {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    
    try {
        await db.deleteTimelineEvent(id);
        await loadTimelineEvents();
        showToast('🗑️ Evento eliminado', 'info');
    } catch (error) {
        console.error(error);
        showToast('❌ Error al eliminar', 'error');
    }
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

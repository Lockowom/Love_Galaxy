// ================================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ================================================

// Fecha de inicio de la relación (personalizar)
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

// Mensajes diarios
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
    "Cada segundo contigo vale más que una eternidad sin ti. ⏰❤️"
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

    // Inicializar observadores de scroll
    initScrollAnimations();

    // Cargar fecha de relación del localStorage
    const savedDate = localStorage.getItem('relationshipStart');
    if (savedDate) {
        relationshipStart = new Date(savedDate);
        document.getElementById('relationship-start').value = savedDate;
        calculateTimeTogether();
    }
    
    // Optimizaciones para móviles
    initMobileOptimizations();
});

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
        });
    }

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
    const currentValue = parseInt(element.textContent) || 0;
    if (currentValue !== targetValue) {
        element.textContent = targetValue.toLocaleString();
    }
}

function calculateTimeTogether() {
    const dateInput = document.getElementById('relationship-start');
    if (dateInput && dateInput.value) {
        relationshipStart = new Date(dateInput.value);
        localStorage.setItem('relationshipStart', dateInput.value);
        
        const resultsDiv = document.getElementById('calculator-results');
        if (resultsDiv) {
            const now = new Date();
            const diff = now - relationshipStart;
            
            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
            const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
            const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor(diff / (1000 * 60));
            const seconds = Math.floor(diff / 1000);
            
            resultsDiv.innerHTML = `
                <div class="result-item">
                    <strong>📅 Años:</strong> ${years} ${years === 1 ? 'año' : 'años'}
                </div>
                <div class="result-item">
                    <strong>📆 Meses:</strong> ${months} ${months === 1 ? 'mes' : 'meses'}
                </div>
                <div class="result-item">
                    <strong>📊 Semanas:</strong> ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}
                </div>
                <div class="result-item">
                    <strong>📈 Días:</strong> ${days.toLocaleString()} ${days === 1 ? 'día' : 'días'}
                </div>
                <div class="result-item">
                    <strong>⏰ Horas:</strong> ${hours.toLocaleString()} ${hours === 1 ? 'hora' : 'horas'}
                </div>
                <div class="result-item">
                    <strong>⏱️ Minutos:</strong> ${minutes.toLocaleString()} ${minutes === 1 ? 'minuto' : 'minutos'}
                </div>
                <div class="result-item">
                    <strong>⚡ Segundos:</strong> ${seconds.toLocaleString()} ${seconds === 1 ? 'segundo' : 'segundos'}
                </div>
                <div class="result-item" style="background: rgba(255, 20, 147, 0.2); border-color: var(--primary-color);">
                    <strong>💕 Conclusión:</strong> ¡Cada segundo contigo vale oro!
                </div>
            `;
        }
        
        updateCounters();
    }
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
        alert('¡Recuerdo guardado! 💕\n\n' + detail);
        // Aquí podrías guardar en localStorage o base de datos
        saveTimelineMemory(type, detail);
    }
}

function saveTimelineMemory(type, detail) {
    const memories = JSON.parse(localStorage.getItem('timelineMemories') || '{}');
    memories[type] = detail;
    localStorage.setItem('timelineMemories', JSON.stringify(memories));
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
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

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

function uploadPhoto(button) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tamaño (máximo 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen es muy grande. Por favor, elige una imagen menor a 2MB.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const galleryItem = button.closest('.gallery-item');
                const placeholder = galleryItem.querySelector('.gallery-placeholder');
                const category = galleryItem.getAttribute('data-category');
                const photoId = galleryItem.getAttribute('data-photo-id') || Date.now().toString();
                
                galleryItem.setAttribute('data-photo-id', photoId);
                
                // Actualizar visual
                placeholder.style.backgroundImage = `url(${event.target.result})`;
                placeholder.style.backgroundSize = 'cover';
                placeholder.style.backgroundPosition = 'center';
                placeholder.innerHTML = '';
                placeholder.classList.add('has-photo');
                
                // Agregar clase para mostrar foto
                galleryItem.classList.add('has-photo');
                
                // Guardar en localStorage
                savePhoto(photoId, event.target.result, category);
                
                // Agregar botones de acción
                updateGalleryItemButtons(galleryItem, photoId);
                
                // Mensaje de éxito
                showToast('✅ Foto guardada exitosamente', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function savePhoto(photoId, dataUrl, category) {
    const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '{}');
    photos[photoId] = {
        dataUrl,
        category,
        date: new Date().toISOString(),
        id: photoId
    };
    localStorage.setItem('galleryPhotos', JSON.stringify(photos));
}

function loadGalleryPhotos() {
    const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '{}');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const photoId = item.getAttribute('data-photo-id');
        if (photoId && photos[photoId]) {
            const photo = photos[photoId];
            const placeholder = item.querySelector('.gallery-placeholder');
            
            placeholder.style.backgroundImage = `url(${photo.dataUrl})`;
            placeholder.style.backgroundSize = 'cover';
            placeholder.style.backgroundPosition = 'center';
            placeholder.innerHTML = '';
            placeholder.classList.add('has-photo');
            item.classList.add('has-photo');
            
            updateGalleryItemButtons(item, photoId);
        }
    });
}

function updateGalleryItemButtons(galleryItem, photoId) {
    const overlay = galleryItem.querySelector('.gallery-overlay');
    if (!overlay) return;
    
    overlay.innerHTML = `
        <button onclick="viewPhotoFullscreen('${photoId}')" class="btn-small btn-view">👁️ Ver</button>
        <button onclick="changePhoto(this)" class="btn-small btn-change">🔄 Cambiar</button>
        <button onclick="deletePhoto('${photoId}', this)" class="btn-small btn-delete">🗑️ Eliminar</button>
    `;
}

function changePhoto(button) {
    uploadPhoto(button);
}

function deletePhoto(photoId, button) {
    if (!confirm('¿Estás seguro de eliminar esta foto?')) return;
    
    const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '{}');
    delete photos[photoId];
    localStorage.setItem('galleryPhotos', JSON.stringify(photos));
    
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
}

function viewPhotoFullscreen(photoId) {
    const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '{}');
    const photo = photos[photoId];
    
    if (!photo) return;
    
    // Crear modal de vista completa
    const modal = document.createElement('div');
    modal.className = 'photo-fullscreen-modal';
    modal.innerHTML = `
        <div class="photo-fullscreen-content">
            <button class="photo-close" onclick="this.closest('.photo-fullscreen-modal').remove()">&times;</button>
            <img src="${photo.dataUrl}" alt="Foto" />
            <div class="photo-info">
                <p>📅 ${new Date(photo.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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

function loadMemories() {
    const memoriesList = document.getElementById('memories-list');
    if (!memoriesList) return;

    const memories = JSON.parse(localStorage.getItem('memories') || '[]');
    
    memoriesList.innerHTML = '';
    
    memories.forEach((memory, index) => {
        const memoryCard = document.createElement('div');
        memoryCard.className = 'memory-card';
        memoryCard.innerHTML = `
            <div class="memory-header">
                <h3 class="memory-title">${memory.title}</h3>
                <span class="memory-mood">${memory.mood}</span>
            </div>
            <p class="memory-date">${new Date(memory.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</p>
            <p class="memory-description">${memory.description}</p>
            <button class="btn-small" onclick="deleteMemory(${index})">Eliminar</button>
        `;
        memoriesList.appendChild(memoryCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const memoryForm = document.getElementById('memory-form');
    if (memoryForm) {
        memoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('memory-title').value;
            const date = document.getElementById('memory-date').value;
            const description = document.getElementById('memory-description').value;
            const mood = document.getElementById('memory-mood').value;
            
            if (title && date && description && mood) {
                const memories = JSON.parse(localStorage.getItem('memories') || '[]');
                memories.unshift({
                    title,
                    date,
                    description,
                    mood,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('memories', JSON.stringify(memories));
                
                memoryForm.reset();
                loadMemories();
                
                // Mostrar confirmación
                showNotification('¡Recuerdo guardado con amor! 💕');
            }
        });
    }
});

function deleteMemory(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este recuerdo?')) {
        const memories = JSON.parse(localStorage.getItem('memories') || '[]');
        memories.splice(index, 1);
        localStorage.setItem('memories', JSON.stringify(memories));
        loadMemories();
        showNotification('Recuerdo eliminado');
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
            quoteText.style.opacity = '0';
            setTimeout(() => {
                quoteText.textContent = `"${randomQuote}"`;
                quoteText.style.opacity = '1';
            }, 300);
        }
    }
}

function saveCustomMessage() {
    const messageText = document.getElementById('custom-message-text');
    if (messageText && messageText.value.trim()) {
        const messages = JSON.parse(localStorage.getItem('customMessages') || '[]');
        messages.push({
            text: messageText.value,
            date: new Date().toISOString()
        });
        localStorage.setItem('customMessages', JSON.stringify(messages));
        
        messageText.value = '';
        showNotification('¡Mensaje guardado con amor! 💌');
    }
}

// ================================================
// MÚSICA
// ================================================

function togglePlay() {
    isPlaying = !isPlaying;
    const playBtn = document.getElementById('play-btn');
    const vinyl = document.querySelector('.vinyl-record');
    
    if (playBtn) {
        playBtn.textContent = isPlaying ? '⏸️' : '▶️';
    }
    
    if (vinyl) {
        if (isPlaying) {
            vinyl.classList.add('playing');
        } else {
            vinyl.classList.remove('playing');
        }
    }
}

function previousSong() {
    const songs = document.querySelectorAll('.playlist-item');
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateCurrentSong();
}

function nextSong() {
    const songs = document.querySelectorAll('.playlist-item');
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateCurrentSong();
}

function setSong(index) {
    currentSongIndex = index - 1;
    updateCurrentSong();
    if (!isPlaying) {
        togglePlay();
    }
}

function updateCurrentSong() {
    const songs = [
        { title: "Nuestra Primera Canción", artist: "El inicio de todo" },
        { title: "La Que Me Recuerda a Ti", artist: "Siempre en mi mente" },
        { title: "Nuestro Himno", artist: "El soundtrack del amor" }
    ];
    
    const currentSong = songs[currentSongIndex];
    const titleElement = document.getElementById('current-song');
    const artistElement = document.getElementById('current-artist');
    
    if (titleElement) titleElement.textContent = currentSong.title;
    if (artistElement) artistElement.textContent = currentSong.artist;
}

function addSongToPlaylist() {
    const title = prompt('Título de la canción:');
    const artist = prompt('Artista:');
    const memory = prompt('¿Qué recuerdo especial tienes con esta canción?');
    
    if (title && artist) {
        showNotification(`¡Canción "${title}" agregada a la playlist! 🎵`);
        // Aquí podrías guardar en localStorage
    }
}

// ================================================
// ANIMACIONES DE SCROLL
// ================================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ================================================
// TIMELINE EDITABLE
// ================================================

function loadTimelineEvents() {
    const timelineContainer = document.querySelector('.timeline');
    if (!timelineContainer) return;
    
    const savedEvents = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
    
    // Si hay eventos guardados, reemplazar los del HTML
    if (savedEvents.length > 0) {
        // Mantener el botón de agregar evento
        const addButton = timelineContainer.querySelector('.timeline-add-btn');
        timelineContainer.innerHTML = '';
        
        savedEvents.forEach((event, index) => {
            const timelineItem = createTimelineItem(event, index);
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
}

function createTimelineItem(event, index) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.setAttribute('data-event-id', index);
    
    item.innerHTML = `
        <div class=\"timeline-content\">
            <div class=\"timeline-icon\">${event.icon || '💕'}</div>
            <h3>${escapeHtml(event.title)}</h3>
            <p class=\"timeline-date\">${escapeHtml(event.date)}</p>
            <p>${escapeHtml(event.description)}</p>
            <div class=\"timeline-actions\">
                <button onclick=\"editTimelineEvent(${index})\" class=\"btn-small\">✏️ Editar</button>
                <button onclick=\"deleteTimelineEvent(${index})\" class=\"btn-small\">🗑️ Eliminar</button>
            </div>
        </div>
    `;
    
    return item;
}

function addTimelineButton(container) {
    const addBtn = document.createElement('div');
    addBtn.className = 'timeline-item timeline-add-btn';
    addBtn.innerHTML = `
        <div class=\"timeline-content add-event-content\">
            <div class=\"timeline-icon\">➕</div>
            <h3>Agregar Evento</h3>
            <p>Añade un momento especial a tu historia</p>
            <button onclick=\"showAddEventModal()\" class=\"btn-primary\">Agregar Evento</button>
        </div>
    `;
    container.appendChild(addBtn);
}

function showAddEventModal() {
    const modal = document.createElement('div');
    modal.className = 'modal timeline-modal active';
    modal.innerHTML = `
        <div class=\"modal-content\">
            <span class=\"modal-close\" onclick=\"this.closest('.modal').remove()\">&times;</span>
            <h2>✨ Agregar Evento a Nuestra Historia</h2>
            <form id=\"timeline-event-form\">
                <div class=\"form-group\">
                    <label>Título del Evento</label>
                    <input type=\"text\" id=\"event-title\" required placeholder=\"Ej: Nuestro Primer Beso\">
                </div>
                <div class=\"form-group\">
                    <label>Fecha</label>
                    <input type=\"text\" id=\"event-date\" required placeholder=\"Ej: Enero 2024\">
                </div>
                <div class=\"form-group\">
                    <label>Descripción</label>
                    <textarea id=\"event-description\" required rows=\"4\" placeholder=\"Describe este momento especial...\"></textarea>
                </div>
                <div class=\"form-group\">
                    <label>Icono (Emoji)</label>
                    <input type=\"text\" id=\"event-icon\" maxlength=\"2\" placeholder=\"💕\">
                </div>
                <div class=\"modal-buttons\">
                    <button type=\"submit\" class=\"btn-primary\">💾 Guardar Evento</button>
                    <button type=\"button\" onclick=\"this.closest('.modal').remove()\" class=\"btn-secondary\">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const form = modal.querySelector('#timeline-event-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const event = {
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            description: document.getElementById('event-description').value,
            icon: document.getElementById('event-icon').value || '💕'
        };
        
        const events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
        events.push(event);
        localStorage.setItem('timelineEvents', JSON.stringify(events));
        
        modal.remove();
        loadTimelineEvents();
        showToast('✅ Evento agregado a tu historia', 'success');
    });
}

function editTimelineEvent(index) {
    const events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
    const event = events[index];
    
    if (!event) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal timeline-modal active';
    modal.innerHTML = `
        <div class=\"modal-content\">
            <span class=\"modal-close\" onclick=\"this.closest('.modal').remove()\">&times;</span>
            <h2>✏️ Editar Evento</h2>
            <form id=\"edit-timeline-form\">
                <div class=\"form-group\">
                    <label>Título del Evento</label>
                    <input type=\"text\" id=\"edit-event-title\" required value=\"${escapeHtml(event.title)}\">
                </div>
                <div class=\"form-group\">
                    <label>Fecha</label>
                    <input type=\"text\" id=\"edit-event-date\" required value=\"${escapeHtml(event.date)}\">
                </div>
                <div class=\"form-group\">
                    <label>Descripción</label>
                    <textarea id=\"edit-event-description\" required rows=\"4\">${escapeHtml(event.description)}</textarea>
                </div>
                <div class=\"form-group\">
                    <label>Icono (Emoji)</label>
                    <input type=\"text\" id=\"edit-event-icon\" maxlength=\"2\" value=\"${event.icon || '💕'}\">
                </div>
                <div class=\"modal-buttons\">
                    <button type=\"submit\" class=\"btn-primary\">💾 Guardar Cambios</button>
                    <button type=\"button\" onclick=\"this.closest('.modal').remove()\" class=\"btn-secondary\">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const form = modal.querySelector('#edit-timeline-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        events[index] = {
            title: document.getElementById('edit-event-title').value,
            date: document.getElementById('edit-event-date').value,
            description: document.getElementById('edit-event-description').value,
            icon: document.getElementById('edit-event-icon').value || '💕'
        };
        
        localStorage.setItem('timelineEvents', JSON.stringify(events));
        
        modal.remove();
        loadTimelineEvents();
        showToast('✅ Evento actualizado', 'success');
    });
}

function deleteTimelineEvent(index) {
    if (!confirm('¿Est\u00e1s seguro de eliminar este evento?')) return;
    
    const events = JSON.parse(localStorage.getItem('timelineEvents') || '[]');
    events.splice(index, 1);
    localStorage.setItem('timelineEvents', JSON.stringify(events));
    
    loadTimelineEvents();
    showToast('🗑️ Evento eliminado', 'info');
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

// Escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

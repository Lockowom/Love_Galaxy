
// ================================================
// SISTEMA DE LOGROS (ACHIEVEMENTS)
// ================================================

class AchievementsManager {
    constructor() {
        this.achievements = [
            {
                id: 'first_login',
                title: 'Primer Encuentro',
                description: 'Visitaste Love Galaxy por primera vez',
                icon: '👋',
                secret: false
            },
            {
                id: 'love_scientist',
                title: 'Científico del Amor',
                description: 'Usaste la calculadora de amor',
                icon: '🧪',
                secret: false
            },
            {
                id: 'galaxy_explorer',
                title: 'Explorador Galáctico',
                description: 'Alcanzaste 1000 puntos en Galaxia del Amor',
                icon: '🚀',
                secret: false
            },
            {
                id: 'galaxy_master',
                title: 'Maestro del Universo',
                description: 'Alcanzaste 5000 puntos en Galaxia del Amor',
                icon: '👑',
                secret: true
            },
            {
                id: 'dj_love',
                title: 'DJ del Amor',
                description: 'Subiste una canción a la playlist',
                icon: '🎧',
                secret: false
            },
            {
                id: 'poet',
                title: 'Poeta Romántico',
                description: 'Escribiste un mensaje personalizado',
                icon: '✍️',
                secret: false
            },
            {
                id: 'memory_keeper',
                title: 'Guardián de Recuerdos',
                description: 'Agregaste un evento a la historia',
                icon: '📅',
                secret: false
            },
            {
                id: 'photographer',
                title: 'Fotógrafo del Amor',
                description: 'Subiste una foto a la galería',
                icon: '📸',
                secret: false
            },
            {
                id: 'curious_heart',
                title: 'Corazón Curioso',
                description: 'Exploraste todas las secciones',
                icon: '🔍',
                secret: true
            }
        ];

        this.unlocked = new Set();
        this.loadProgress();
    }

    async loadProgress() {
        // Intentar cargar desde DB si está disponible, sino LocalStorage
        try {
            if (window.db && window.db.getAchievements) {
                const saved = await window.db.getAchievements();
                saved.forEach(id => this.unlocked.add(id));
            } else {
                const saved = localStorage.getItem('love_galaxy_achievements');
                if (saved) {
                    JSON.parse(saved).forEach(id => this.unlocked.add(id));
                }
            }
        } catch (e) {
            console.error('Error cargando logros:', e);
        }
    }

    async unlock(id) {
        if (this.unlocked.has(id)) return; // Ya desbloqueado

        const achievement = this.achievements.find(a => a.id === id);
        if (!achievement) return;

        this.unlocked.add(id);
        this.saveProgress(id);
        this.showNotification(achievement);
        this.updateUI(); // Si el modal está abierto
    }

    async saveProgress(newId) {
        // Guardar en LocalStorage siempre como backup rápido
        localStorage.setItem('love_galaxy_achievements', JSON.stringify([...this.unlocked]));

        // Guardar en DB
        try {
            if (window.db && window.db.unlockAchievement) {
                await window.db.unlockAchievement(newId);
            }
        } catch (e) {
            console.error('Error guardando logro en DB:', e);
        }
    }

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-text">
                <h4>¡Logro Desbloqueado!</h4>
                <p>${achievement.title}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Sonido de logro (opcional)
        this.playAchievementSound();

        // Eliminar después de 4 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    playAchievementSound() {
        // Simple sonido generado con oscilador para no depender de archivos externos
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
            osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.4); // C6
            
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        } catch (e) {
            // Ignorar errores de audio (ej. interacción usuario requerida)
        }
    }

    // Método para renderizar la lista de logros en un contenedor
    renderList(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        this.achievements.forEach(ach => {
            const isUnlocked = this.unlocked.has(ach.id);
            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            let icon = isUnlocked ? ach.icon : '🔒';
            let title = isUnlocked ? ach.title : (ach.secret ? '???' : ach.title);
            let desc = isUnlocked ? ach.description : (ach.secret ? 'Logro Secreto' : ach.description);
            
            card.innerHTML = `
                <span class="achievement-card-icon">${icon}</span>
                <h3>${title}</h3>
                <p>${desc}</p>
                ${isUnlocked ? '<span class="achievement-date">¡Conseguido!</span>' : ''}
            `;
            
            container.appendChild(card);
        });
    }

    updateUI() {
        // Actualizar lista si existe en el DOM actual
        const list = document.getElementById('achievements-list');
        if (list) this.renderList('achievements-list');
        
        // Actualizar contador en botón si existe
        const count = document.getElementById('achievements-count');
        if (count) count.textContent = `${this.unlocked.size}/${this.achievements.length}`;
    }
}

// Inicializar
window.achievements = new AchievementsManager();

// Helper global
function openAchievementsModal() {
    const modal = document.getElementById('achievements-modal');
    if (modal) {
        modal.classList.add('active');
        window.achievements.renderList('achievements-list');
    }
}

function closeAchievementsModal() {
    const modal = document.getElementById('achievements-modal');
    if (modal) modal.classList.remove('active');
}

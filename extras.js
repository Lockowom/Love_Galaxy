// ================================================
// UTILIDADES EXTRAS Y FUNCIONES ESPECIALES
// ================================================

// ================================================
// SISTEMA DE NOTIFICACIONES ROMÁNTICAS
// ================================================

class LoveNotificationSystem {
    constructor() {
        this.notifications = [
            "💕 Recuerda decirle lo especial que es hoy",
            "🌹 Tal vez sea momento para un detalle especial",
            "✨ Tu sonrisa hace su día mejor",
            "💖 No olvides enviarle un mensaje de amor",
            "🌟 Cada momento con ella es un regalo",
            "💝 ¿Qué tal una sorpresa hoy?",
            "🎁 Un pequeño gesto vale más que mil palabras",
            "💞 Recuerda por qué te enamoraste"
        ];
        
        this.init();
    }

    init() {
        // Mostrar notificación cada 30 minutos
        setInterval(() => {
            this.showRandomNotification();
        }, 30 * 60 * 1000);
        
        // Primera notificación después de 5 minutos
        setTimeout(() => {
            this.showRandomNotification();
        }, 5 * 60 * 1000);
    }

    showRandomNotification() {
        const message = this.notifications[Math.floor(Math.random() * this.notifications.length)];
        if (window.showToast) {
            window.showToast(message, 5000);
        }
    }
}

// ================================================
// SISTEMA DE RECORDATORIOS DE ANIVERSARIOS
// ================================================

class AnniversaryReminder {
    constructor() {
        this.checkAnniversaries();
        // Verificar cada día
        setInterval(() => {
            this.checkAnniversaries();
        }, 24 * 60 * 60 * 1000);
    }

    checkAnniversaries() {
        const savedDate = localStorage.getItem('relationshipStart');
        if (!savedDate) return;

        const startDate = new Date(savedDate);
        const today = new Date();
        
        const months = this.monthsBetween(startDate, today);
        const years = Math.floor(months / 12);
        
        // Comprobar si hoy es el día
        if (startDate.getDate() === today.getDate() && 
            startDate.getMonth() === today.getMonth()) {
            
            if (years > 0) {
                this.celebrateAnniversary(years, 'años');
            } else if (months > 0) {
                this.celebrateAnniversary(months, 'meses');
            }
        }
    }

    monthsBetween(date1, date2) {
        return (date2.getFullYear() - date1.getFullYear()) * 12 + 
               (date2.getMonth() - date1.getMonth());
    }

    celebrateAnniversary(count, unit) {
        // Confeti automático
        if (window.triggerConfetti) {
            window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
        }

        // Notificación especial
        const message = `🎉 ¡Feliz Aniversario! 💕\n\nHoy celebran ${count} ${unit} juntos.\n\n¡Que sigan muchos más!`;
        
        setTimeout(() => {
            alert(message);
        }, 1000);
    }
}

// ================================================
// GENERADOR DE POEMAS DE AMOR
// ================================================

class PoemGenerator {
    constructor() {
        this.templates = [
            {
                title: "Eres Mi Todo",
                verses: [
                    "En tus ojos encuentro mi universo,",
                    "Tu sonrisa ilumina mi verso,",
                    "Eres la melodía que mi corazón canta,",
                    "El amor que mi alma levanta."
                ]
            },
            {
                title: "Amor Eterno",
                verses: [
                    "Como las estrellas en el cielo brillan,",
                    "Así tus ojos mi noche iluminan,",
                    "Eres el sueño que no quiero despertar,",
                    "El amor que siempre voy a amar."
                ]
            },
            {
                title: "Mi Inspiración",
                verses: [
                    "Eres la poesía que no necesito escribir,",
                    "El arte que no puedo definir,",
                    "La música que siempre quiero escuchar,",
                    "El amor que no puedo olvidar."
                ]
            }
        ];
    }

    generate() {
        const poem = this.templates[Math.floor(Math.random() * this.templates.length)];
        return {
            title: poem.title,
            content: poem.verses.join('\n')
        };
    }

    display() {
        const poem = this.generate();
        const modal = this.createPoemModal(poem);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    createPoemModal(poem) {
        const modal = document.createElement('div');
        modal.className = 'modal poem-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2 style="font-family: var(--font-decorative); color: var(--primary-color); margin-bottom: 2rem;">
                    ${poem.title}
                </h2>
                <div style="font-family: var(--font-elegant); font-size: 1.3rem; line-height: 2; text-align: center; white-space: pre-line; color: var(--text-secondary);">
                    ${poem.content}
                </div>
                <div style="margin-top: 3rem; text-align: center;">
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">
                        Cerrar 💕
                    </button>
                </div>
            </div>
        `;
        return modal;
    }
}

// ================================================
// SISTEMA DE LOGROS Y RECOMPENSAS
// ================================================

class AchievementSystem {
    constructor() {
        this.achievements = [
            {
                id: 'first_memory',
                name: 'Primer Recuerdo',
                description: 'Guarda tu primer recuerdo especial',
                icon: '📝',
                unlocked: false
            },
            {
                id: 'photo_collector',
                name: 'Coleccionista de Momentos',
                description: 'Sube 5 fotos a la galería',
                icon: '📸',
                unlocked: false
            },
            {
                id: 'love_writer',
                name: 'Escritor del Amor',
                description: 'Escribe 10 mensajes personalizados',
                icon: '✍️',
                unlocked: false
            },
            {
                id: 'game_master',
                name: 'Maestro del Juego',
                description: 'Completa todos los juegos al menos una vez',
                icon: '🎮',
                unlocked: false
            },
            {
                id: 'one_month',
                name: 'Un Mes de Amor',
                description: 'Celebra un mes juntos',
                icon: '💕',
                unlocked: false
            },
            {
                id: 'one_year',
                name: 'Un Año Especial',
                description: 'Celebra un año de amor',
                icon: '🎉',
                unlocked: false
            }
        ];
        
        this.load();
    }

    load() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            const savedData = JSON.parse(saved);
            this.achievements.forEach(achievement => {
                const savedAchievement = savedData.find(a => a.id === achievement.id);
                if (savedAchievement) {
                    achievement.unlocked = savedAchievement.unlocked;
                }
            });
        }
    }

    save() {
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }

    unlock(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.save();
            this.showUnlockNotification(achievement);
        }
    }

    showUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 10px 50px rgba(255, 20, 147, 0.7);
            z-index: 10002;
            text-align: center;
            animation: zoomIn 0.5s ease;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 5rem; margin-bottom: 1rem;">${achievement.icon}</div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">¡Logro Desbloqueado!</h2>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${achievement.name}</h3>
            <p style="opacity: 0.9;">${achievement.description}</p>
        `;
        
        document.body.appendChild(notification);
        
        // Confeti
        if (window.triggerConfetti) {
            window.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 30);
        }
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    checkMemoryAchievement() {
        const memories = JSON.parse(localStorage.getItem('memories') || '[]');
        if (memories.length >= 1) this.unlock('first_memory');
        if (memories.length >= 10) this.unlock('love_writer');
    }

    checkPhotoAchievement() {
        const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
        if (photos.length >= 5) this.unlock('photo_collector');
    }

    displayAll() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        
        const achievementsHTML = this.achievements.map(achievement => `
            <div style="
                background: ${achievement.unlocked ? 'rgba(255, 20, 147, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
                border: 2px solid ${achievement.unlocked ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)'};
                border-radius: 15px;
                padding: 1.5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                opacity: ${achievement.unlocked ? '1' : '0.5'};
            ">
                <div style="font-size: 3rem;">${achievement.icon}</div>
                <div style="flex: 1;">
                    <h4 style="color: var(--primary-color); margin-bottom: 0.3rem;">${achievement.name}</h4>
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">${achievement.description}</p>
                </div>
                <div style="font-size: 1.5rem;">
                    ${achievement.unlocked ? '✅' : '🔒'}
                </div>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">
                    🏆 Logros de Amor
                </h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${achievementsHTML}
                </div>
                <div style="margin-top: 2rem; text-align: center;">
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

// ================================================
// EXPORTADOR DE DATOS
// ================================================

class DataExporter {
    exportAllData() {
        const data = {
            memories: JSON.parse(localStorage.getItem('memories') || '[]'),
            photos: JSON.parse(localStorage.getItem('galleryPhotos') || '[]'),
            messages: JSON.parse(localStorage.getItem('customMessages') || '[]'),
            questionAnswers: JSON.parse(localStorage.getItem('questionAnswers') || '[]'),
            relationshipStart: localStorage.getItem('relationshipStart'),
            achievements: JSON.parse(localStorage.getItem('achievements') || '[]'),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `LoveGalaxy_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (window.showToast) {
            window.showToast('✅ Datos exportados exitosamente');
        }
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.memories) localStorage.setItem('memories', JSON.stringify(data.memories));
                if (data.photos) localStorage.setItem('galleryPhotos', JSON.stringify(data.photos));
                if (data.messages) localStorage.setItem('customMessages', JSON.stringify(data.messages));
                if (data.questionAnswers) localStorage.setItem('questionAnswers', JSON.stringify(data.questionAnswers));
                if (data.relationshipStart) localStorage.setItem('relationshipStart', data.relationshipStart);
                if (data.achievements) localStorage.setItem('achievements', JSON.stringify(data.achievements));
                
                if (window.showToast) {
                    window.showToast('✅ Datos importados exitosamente');
                }
                
                // Recargar página para reflejar cambios
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } catch (error) {
                alert('Error al importar datos. Asegúrate de que el archivo sea válido.');
            }
        };
        reader.readAsText(file);
    }
}

// ================================================
// GENERADOR DE ESTADÍSTICAS
// ================================================

class LoveStatistics {
    generate() {
        const memories = JSON.parse(localStorage.getItem('memories') || '[]');
        const photos = JSON.parse(localStorage.getItem('galleryPhotos') || '[]');
        const messages = JSON.parse(localStorage.getItem('customMessages') || '[]');
        const questionAnswers = JSON.parse(localStorage.getItem('questionAnswers') || '[]');
        
        const stats = {
            totalMemories: memories.length,
            totalPhotos: photos.length,
            totalMessages: messages.length,
            totalQuestions: questionAnswers.length,
            favoriteEmoji: this.getFavoriteEmoji(memories),
            oldestMemory: this.getOldestMemory(memories),
            newestMemory: this.getNewestMemory(memories)
        };
        
        return stats;
    }

    getFavoriteEmoji(memories) {
        const emojiCount = {};
        memories.forEach(memory => {
            if (memory.mood) {
                emojiCount[memory.mood] = (emojiCount[memory.mood] || 0) + 1;
            }
        });
        
        let maxEmoji = '💕';
        let maxCount = 0;
        for (const [emoji, count] of Object.entries(emojiCount)) {
            if (count > maxCount) {
                maxCount = count;
                maxEmoji = emoji;
            }
        }
        
        return maxEmoji;
    }

    getOldestMemory(memories) {
        if (memories.length === 0) return null;
        return memories.reduce((oldest, memory) => {
            return new Date(memory.date) < new Date(oldest.date) ? memory : oldest;
        });
    }

    getNewestMemory(memories) {
        if (memories.length === 0) return null;
        return memories.reduce((newest, memory) => {
            return new Date(memory.date) > new Date(newest.date) ? memory : newest;
        });
    }

    display() {
        const stats = this.generate();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2 style="text-align: center; color: var(--primary-color); margin-bottom: 2rem;">
                    📊 Estadísticas de Amor
                </h2>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
                    <div style="background: rgba(255, 20, 147, 0.1); padding: 1.5rem; border-radius: 15px; text-align: center;">
                        <div style="font-size: 3rem; color: var(--primary-color);">${stats.totalMemories}</div>
                        <div style="color: var(--text-secondary);">Recuerdos Guardados</div>
                    </div>
                    <div style="background: rgba(255, 20, 147, 0.1); padding: 1.5rem; border-radius: 15px; text-align: center;">
                        <div style="font-size: 3rem; color: var(--primary-color);">${stats.totalPhotos}</div>
                        <div style="color: var(--text-secondary);">Fotos Subidas</div>
                    </div>
                    <div style="background: rgba(255, 20, 147, 0.1); padding: 1.5rem; border-radius: 15px; text-align: center;">
                        <div style="font-size: 3rem; color: var(--primary-color);">${stats.totalMessages}</div>
                        <div style="color: var(--text-secondary);">Mensajes Escritos</div>
                    </div>
                    <div style="background: rgba(255, 20, 147, 0.1); padding: 1.5rem; border-radius: 15px; text-align: center;">
                        <div style="font-size: 3rem;">${stats.favoriteEmoji}</div>
                        <div style="color: var(--text-secondary);">Estado Favorito</div>
                    </div>
                </div>
                <div style="margin-top: 2rem; text-align: center;">
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
}

// ================================================
// INICIALIZACIÓN DE SISTEMAS
// ================================================

let achievementSystem;
let poemGenerator;
let dataExporter;
let loveStatistics;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistemas
    new LoveNotificationSystem();
    new AnniversaryReminder();
    
    achievementSystem = new AchievementSystem();
    poemGenerator = new PoemGenerator();
    dataExporter = new DataExporter();
    loveStatistics = new LoveStatistics();
    
    // Funciones globales
    window.showPoem = () => poemGenerator.display();
    window.showAchievements = () => achievementSystem.displayAll();
    window.showStatistics = () => loveStatistics.display();
    window.exportData = () => dataExporter.exportAllData();
    
    console.log('🌟 Sistemas extras cargados correctamente');
});

// ================================================
// MENÚ DE CONFIGURACIÓN
// ================================================

function createSettingsMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(26, 10, 31, 0.95);
        border: 2px solid var(--primary-color);
        border-radius: 20px;
        padding: 1.5rem;
        z-index: 1001;
        min-width: 250px;
        box-shadow: 0 10px 40px rgba(255, 20, 147, 0.5);
    `;
    
    menu.innerHTML = `
        <h3 style="color: var(--primary-color); margin-bottom: 1rem; text-align: center;">
            ⚙️ Menú Especial
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="btn-small" onclick="window.showPoem()" style="width: 100%;">
                📝 Generar Poema
            </button>
            <button class="btn-small" onclick="window.showAchievements()" style="width: 100%;">
                🏆 Ver Logros
            </button>
            <button class="btn-small" onclick="window.showStatistics()" style="width: 100%;">
                📊 Estadísticas
            </button>
            <button class="btn-small" onclick="window.exportData()" style="width: 100%;">
                💾 Exportar Datos
            </button>
            <button class="btn-small" onclick="this.closest('div').remove()" style="width: 100%;">
                ❌ Cerrar
            </button>
        </div>
    `;
    
    document.body.appendChild(menu);
}

// Botón flotante para abrir menú
document.addEventListener('DOMContentLoaded', () => {
    const floatingButton = document.createElement('button');
    floatingButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        border: none;
        font-size: 2rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(255, 20, 147, 0.5);
        z-index: 1000;
        transition: transform 0.3s ease;
    `;
    floatingButton.innerHTML = '⚙️';
    floatingButton.onclick = createSettingsMenu;
    
    floatingButton.addEventListener('mouseenter', () => {
        floatingButton.style.transform = 'scale(1.1) rotate(90deg)';
    });
    
    floatingButton.addEventListener('mouseleave', () => {
        floatingButton.style.transform = 'scale(1) rotate(0deg)';
    });
    
    document.body.appendChild(floatingButton);
});

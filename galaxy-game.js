// ================================================
// GALAXIA DEL AMOR - JUEGO INTERACTIVO MEJORADO
// ================================================

class GalaxyLoveGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Estado del juego
        this.isPlaying = false;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        
        // High Score
        this.highScore = 0;
        this.loadHighScore();
        
        // Jugador (nave/corazón)
        this.player = {
            x: 0,
            y: 0,
            width: 60,
            height: 60,
            speed: 6, // Velocidad aumentada ligeramente
            emoji: '💖',
            angle: 0, // Para rotación suave al mover
            invincible: false,
            invincibleTime: 0,
            trail: [] // Estela de movimiento
        };
        
        // Controles
        this.keys = {};
        
        // Elementos del juego
        this.hearts = [];
        this.messages = [];
        this.obstacles = [];
        this.powerUps = [];
        this.particles = [];
        this.stars = [];
        this.floatingTexts = []; // Textos flotantes separados
        
        // Configuración
        this.heartSpawnRate = 50;
        this.messageSpawnRate = 150;
        this.obstacleSpawnRate = 100;
        this.powerUpSpawnRate = 300;
        
        // Mensajes de amor (Extendidos)
        this.loveMessages = [
            "Te Amo ✨", "Eres Mi Vida 💕", "Mi Corazón Es Tuyo 💖",
            "Amor Eterno 💞", "Juntos Por Siempre 💗", "Eres Mi Todo 💓",
            "Mi Alma Gemela 💝", "Te Adoro 💘", "Mi Inspiración 🌟",
            "Eres Perfecta 💫", "Mi Felicidad Eres Tú ✨", "Te Necesito 💕",
            "Eres Mi Sueño 🌙", "Mi Razón de Vivir 💖", "Contigo Soy Feliz 😊",
            "Mi Amor Infinito ♾️", "Eres Mi Estrella ⭐", "Te Pienso Siempre 💭",
            "Mi Mundo Eres Tú 🌍", "Eres Única 💎", "Mi Tesoro 💰",
            "Te Amo Más Cada Día 📈", "Eres Especial 🎁", "Mi Ángel 👼",
            "Contigo Todo Es Mejor 🌈", "Eres Mi Luz ☀️", "Mi Corazón Late Por Ti 💓",
            "Eres Mi Paraíso 🏝️", "Te Extraño 😢", "Eres Hermosa 🌺",
            "Gracias por Existir 🙏", "Mi Lugar Favorito 🏡", "Eres Magia ✨"
        ];
        
        // Power-ups
        this.powerUpTypes = [
            { type: 'shield', emoji: '🛡️', name: 'Escudo', duration: 300, color: '#00ffff' }, // 5 segs (60fps)
            { type: 'magnet', emoji: '🧲', name: 'Imán', duration: 420, color: '#ffd700' }, // 7 segs
            { type: 'multiplier', emoji: '✖️2️⃣', name: 'x2 Puntos', duration: 600, color: '#00ff00' }, // 10 segs
            { type: 'slow', emoji: '🐌', name: 'Cámara Lenta', duration: 300, color: '#ff69b4' }, // 5 segs
            { type: 'life', emoji: '❤️', name: 'Vida Extra', duration: 0, color: '#ff1493' },
            { type: 'blast', emoji: '💥', name: 'Limpieza', duration: 0, color: '#ff4500' } // Nuevo: Destruye obstáculos
        ];
        
        // Efectos activos
        this.activeEffects = {
            shield: 0,
            magnet: 0,
            multiplier: 0,
            slowMotion: 0
        };
        
        // Contadores
        this.frameCount = 0;
        this.gameTime = 0;
        
        // Combo
        this.combo = 0;
        this.comboTime = 0;
        this.maxCombo = 0;

        // Imágenes pre-renderizadas (optimización)
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
    }

    async loadHighScore() {
        if (window.db && window.db.getHighScore) {
            this.highScore = await window.db.getHighScore('galaxyLove');
        } else {
            this.highScore = parseInt(localStorage.getItem('galaxyLoveHighScore')) || 0;
        }
    }

    init(containerId) {
        // Crear canvas
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        // Ajustar al tamaño real de la ventana para full screen
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.cssText = `
            display: block;
            width: 100%;
            height: 100%;
            cursor: none; /* Ocultar cursor nativo dentro del juego */
        `;
        
        this.ctx = this.canvas.getContext('2d', { alpha: false }); // Optimización alpha
        container.appendChild(this.canvas);
        
        // Listener para resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Inicializar jugador
        this.player.x = this.width / 2 - this.player.width / 2;
        this.player.y = this.height - 100;
        
        // Crear estrellas de fondo (más estrellas para efecto profundidad)
        this.createStars();
        
        // Event listeners
        this.setupControls();
        
        // Mostrar menú inicial
        this.showStartScreen();
    }

    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.canvas) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }
        // Reajustar posición del jugador si se sale
        this.clampPlayer();
        // Regenerar estrellas para cubrir nueva área
        this.createStars();
    }

    setupControls() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // P para pausar
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mouse/Touch para móvil
        const updatePos = (clientX, clientY) => {
            if (this.isPlaying && !this.isPaused) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;

                const targetX = (clientX - rect.left) * scaleX - this.player.width / 2;
                const targetY = (clientY - rect.top) * scaleY - this.player.height / 2;
                
                // Interpolación suave para el mouse
                this.player.x += (targetX - this.player.x) * 0.5;
                this.player.y += (targetY - this.player.y) * 0.5;
                
                this.clampPlayer();
            }
        };

        this.canvas.addEventListener('mousemove', (e) => updatePos(e.clientX, e.clientY));
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            updatePos(touch.clientX, touch.clientY);
        }, { passive: false });
    }

    createStars() {
        this.stars = [];
        // 3 capas de estrellas para efecto paralaje
        const layers = [
            { count: 50, speed: 0.5, size: 1, color: '#ffffff55' }, // Fondo lejano
            { count: 30, speed: 1.0, size: 2, color: '#ffffffaa' }, // Medio
            { count: 20, speed: 2.0, size: 3, color: '#ffffff' }    // Frente
        ];

        layers.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
                this.stars.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: Math.random() * layer.size + 0.5,
                    baseSpeed: layer.speed,
                    speed: layer.speed * (Math.random() * 0.5 + 0.8),
                    color: layer.color,
                    twinkle: Math.random() * Math.PI * 2
                });
            }
        });
    }

    showStartScreen() {
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Fondo animado simple
        this.drawStars();

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Título con efecto de brillo
        this.ctx.save();
        this.ctx.shadowColor = '#ff1493';
        this.ctx.shadowBlur = 20;
        this.ctx.font = 'bold 54px "Arial", sans-serif';
        this.ctx.fillStyle = '#ff1493';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('💫 Galaxia del Amor 💫', this.width / 2, 120);
        this.ctx.restore();
        
        // Instrucciones
        this.ctx.font = '22px Arial';
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.fillText('Navega por el cosmos recolectando amor', this.width / 2, 200);
        
        // Iconos
        const iconsY = 280;
        this.ctx.font = '30px Arial';
        this.ctx.fillText('💖   +10 pts', this.width / 2 - 150, iconsY);
        this.ctx.fillText('💔   -1 Vida', this.width / 2 + 150, iconsY);
        
        // Power-ups
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = '#ff69b4';
        this.ctx.fillText('Power-ups Especiales:', this.width / 2, 350);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('🛡️ Escudo   🧲 Imán   ✖️2️⃣ Doble Puntos   💥 Limpieza', this.width / 2, 390);
        
        // High Score
        if (this.highScore > 0) {
            this.ctx.save();
            this.ctx.shadowColor = '#ffd700';
            this.ctx.shadowBlur = 10;
            this.ctx.font = 'bold 26px Arial';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillText(`🏆 Récord Actual: ${this.highScore}`, this.width / 2, 460);
            this.ctx.restore();
        }
        
        // Botón start animado
        const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillStyle = `rgba(255, 20, 147, ${0.7 + pulse * 0.3})`;
        this.ctx.fillText('Haz CLICK o presiona ESPACIO para Iniciar', this.width / 2, 540);
        
        // Loop de animación del menú
        if (!this.isPlaying) {
            this.menuAnimationId = requestAnimationFrame(() => this.showStartScreen());
        }
        
        // Esperar input (solo una vez)
        if (!this.inputHandlerAttached) {
            const startHandler = (e) => {
                if ((e.key === ' ' || e.type === 'click') && !this.isPlaying) {
                    cancelAnimationFrame(this.menuAnimationId);
                    this.startGame();
                }
            };
            window.addEventListener('keydown', startHandler);
            this.canvas.addEventListener('click', startHandler);
            this.inputHandlerAttached = true;
        }
    }

    startGame() {
        this.isPlaying = true;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.combo = 0;
        this.maxCombo = 0;
        this.frameCount = 0;
        this.gameTime = 0;
        
        this.hearts = [];
        this.messages = [];
        this.obstacles = [];
        this.powerUps = [];
        this.particles = [];
        this.floatingTexts = [];
        this.player.trail = [];
        
        this.activeEffects = {
            shield: 0,
            magnet: 0,
            multiplier: 0,
            slowMotion: 0
        };
        
        this.gameLoop();
    }

    gameLoop() {
        if (!this.isPlaying) return;
        
        if (!this.isPaused) {
            this.update();
        }
        
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.frameCount++;
        this.gameTime++;
        
        // Actualizar nivel (curva de dificultad más suave)
        const newLevel = Math.floor(this.score / 800) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.showLevelUp();
        }
        
        // Movimiento del jugador
        const speed = this.player.speed * (this.activeEffects.slowMotion > 0 ? 1.5 : 1); // Más rápido en slow motion relativo
        let dx = 0;
        let dy = 0;

        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) dx = -speed;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) dx = speed;
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) dy = -speed;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) dy = speed;
        
        this.player.x += dx;
        this.player.y += dy;
        
        // Rotación suave basada en movimiento horizontal
        this.player.angle = dx * 0.05;

        // Estela del jugador
        if (this.frameCount % 3 === 0) {
            this.player.trail.push({ x: this.player.x, y: this.player.y, alpha: 0.6 });
            if (this.player.trail.length > 10) this.player.trail.shift();
        }
        this.player.trail.forEach(t => t.alpha -= 0.05);

        this.clampPlayer();
        
        // Actualizar estrellas
        this.updateStars();
        
        // Spawn elementos
        this.spawnElements();
        
        // Actualizar elementos
        this.updateHearts();
        this.updateMessages();
        this.updateObstacles();
        this.updatePowerUps();
        this.updateParticles();
        this.updateFloatingTexts();
        
        // Actualizar efectos
        this.updateEffects();
        
        // Actualizar combo
        if (this.comboTime > 0) {
            this.comboTime--;
        } else {
            this.combo = 0;
        }
        
        // Invencibilidad temporal
        if (this.player.invincible) {
            this.player.invincibleTime--;
            if (this.player.invincibleTime <= 0) {
                this.player.invincible = false;
            }
        }
    }

    updateStars() {
        const speedFactor = this.activeEffects.slowMotion > 0 ? 0.2 : 1;
        this.stars.forEach(star => {
            star.y += star.speed * speedFactor;
            star.twinkle += 0.05;
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        });
    }

    spawnElements() {
        const speedMod = this.activeEffects.slowMotion > 0 ? 2 : 1;
        const levelFactor = Math.min(this.level, 10); // Cap dificultad

        // Spawn corazones
        if (this.frameCount % Math.floor(this.heartSpawnRate / (1 + levelFactor * 0.1) * speedMod) === 0) {
            this.spawnHeart();
        }
        
        // Spawn mensajes
        if (this.frameCount % Math.floor(this.messageSpawnRate * speedMod) === 0) {
            this.spawnMessage();
        }
        
        // Spawn obstáculos
        if (this.frameCount % Math.floor(this.obstacleSpawnRate / (1 + levelFactor * 0.15) * speedMod) === 0) {
            this.spawnObstacle();
        }
        
        // Spawn power-ups
        if (this.frameCount % Math.floor(this.powerUpSpawnRate * speedMod) === 0) {
            this.spawnPowerUp();
        }
    }

    spawnHeart() {
        const heartTypes = ['💕', '💖', '💗', '💓', '💞', '💝', '❤️', '💘'];
        this.hearts.push({
            x: Math.random() * (this.width - 40),
            y: -40,
            width: 40,
            height: 40,
            speed: (2 + Math.random() + this.level * 0.2),
            emoji: heartTypes[Math.floor(Math.random() * heartTypes.length)],
            points: 10,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            scale: 1,
            pulse: 0,
            oscillation: Math.random() * Math.PI * 2
        });
    }

    spawnMessage() {
        const message = this.loveMessages[Math.floor(Math.random() * this.loveMessages.length)];
        this.messages.push({
            x: Math.random() * (this.width - 150),
            y: -50,
            width: 160,
            height: 40,
            speed: (1.5 + this.level * 0.1),
            text: message,
            points: 50,
            color: `hsl(${Math.random() * 60 + 300}, 100%, 75%)`,
            glow: 0
        });
    }

    spawnObstacle() {
        const obstacleTypes = ['💔', '☁️', '🌑', '⚡', '🧊'];
        this.obstacles.push({
            x: Math.random() * (this.width - 50),
            y: -50,
            width: 50,
            height: 50,
            speed: (2.5 + Math.random() + this.level * 0.3),
            emoji: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)],
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }

    spawnPowerUp() {
        const powerUp = this.powerUpTypes[Math.floor(Math.random() * this.powerUpTypes.length)];
        this.powerUps.push({
            x: Math.random() * (this.width - 45),
            y: -45,
            width: 45,
            height: 45,
            speed: 2,
            type: powerUp.type,
            emoji: powerUp.emoji,
            name: powerUp.name,
            duration: powerUp.duration,
            color: powerUp.color,
            pulse: 0
        });
    }

    updateHearts() {
        const speedMod = this.activeEffects.slowMotion > 0 ? 0.4 : 1;
        
        this.hearts = this.hearts.filter(heart => {
            heart.y += heart.speed * speedMod;
            heart.x += Math.sin(heart.oscillation + this.frameCount * 0.05) * 0.5; // Ligera oscilación lateral
            heart.rotation += heart.rotationSpeed;
            heart.pulse += 0.1;
            heart.scale = 1 + Math.sin(heart.pulse) * 0.1;
            
            // Efecto imán mejorado
            if (this.activeEffects.magnet > 0) {
                const dx = this.player.x + this.player.width / 2 - (heart.x + heart.width / 2);
                const dy = this.player.y + this.player.height / 2 - (heart.y + heart.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 300) {
                    heart.x += dx * 0.08;
                    heart.y += dy * 0.08;
                }
            }
            
            if (this.checkCollision(this.player, heart)) {
                this.collectHeart(heart);
                return false;
            }
            
            return heart.y < this.height + 50;
        });
    }

    updateMessages() {
        const speedMod = this.activeEffects.slowMotion > 0 ? 0.4 : 1;
        
        this.messages = this.messages.filter(message => {
            message.y += message.speed * speedMod;
            message.glow = Math.abs(Math.sin(this.frameCount * 0.1)) * 15;
            
            if (this.activeEffects.magnet > 0) {
                const dx = this.player.x + this.player.width / 2 - (message.x + message.width / 2);
                const dy = this.player.y + this.player.height / 2 - (message.y + message.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 300) {
                    message.x += dx * 0.05;
                    message.y += dy * 0.05;
                }
            }
            
            if (this.checkCollision(this.player, message)) {
                this.collectMessage(message);
                return false;
            }
            
            return message.y < this.height + 50;
        });
    }

    updateObstacles() {
        const speedMod = this.activeEffects.slowMotion > 0 ? 0.4 : 1;
        
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.y += obstacle.speed * speedMod;
            obstacle.rotation += obstacle.rotationSpeed;
            
            if (!this.player.invincible && this.activeEffects.shield <= 0 && 
                this.checkCollision(this.player, obstacle)) {
                this.hitObstacle();
                return false;
            }
            
            // Si hay escudo, el obstáculo se destruye al tocar
            if (this.activeEffects.shield > 0 && this.checkCollision(this.player, obstacle)) {
                this.createParticles(obstacle.x, obstacle.y, '✨', '#fff');
                return false;
            }
            
            return obstacle.y < this.height + 50;
        });
    }

    updatePowerUps() {
        const speedMod = this.activeEffects.slowMotion > 0 ? 0.4 : 1;
        
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.y += powerUp.speed * speedMod;
            powerUp.pulse += 0.15;
            
            if (this.checkCollision(this.player, powerUp)) {
                this.collectPowerUp(powerUp);
                return false;
            }
            
            return powerUp.y < this.height + 50;
        });
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravedad
            particle.life--;
            particle.opacity = particle.life / particle.maxLife;
            particle.rotation += particle.rotationSpeed;
            
            return particle.life > 0;
        });
    }

    updateFloatingTexts() {
        this.floatingTexts = this.floatingTexts.filter(text => {
            text.y += text.vy;
            text.life--;
            text.opacity = Math.min(1, text.life / 30);
            text.scale = 1 + Math.sin((text.maxLife - text.life) * 0.1) * 0.2;
            return text.life > 0;
        });
    }

    updateEffects() {
        for (const effect in this.activeEffects) {
            if (this.activeEffects[effect] > 0) {
                this.activeEffects[effect]--;
            }
        }
    }

    collectHeart(heart) {
        const points = heart.points * (this.activeEffects.multiplier > 0 ? 2 : 1);
        this.score += points;
        
        this.combo++;
        this.comboTime = 150; // 2.5s
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        
        if (this.combo > 5) this.score += this.combo * 5;
        
        // Efectos
        this.createParticles(heart.x, heart.y, heart.emoji);
        this.showFloatingText(`+${points}`, heart.x, heart.y, '#ff69b4');
        if (this.combo > 1) this.showFloatingText(`${this.combo}x Combo!`, heart.x, heart.y - 30, '#ffd700');
    }

    collectMessage(message) {
        const points = message.points * (this.activeEffects.multiplier > 0 ? 2 : 1);
        this.score += points;
        this.combo += 2;
        this.comboTime = 150;
        
        this.createParticles(message.x, message.y, '✨', message.color);
        this.showFloatingText(message.text, message.x, message.y, message.color, 40);
        this.showFloatingText(`+${points}`, message.x, message.y - 40, '#fff');
    }

    collectPowerUp(powerUp) {
        if (powerUp.type === 'life') {
            this.lives = Math.min(this.lives + 1, 5);
        } else if (powerUp.type === 'blast') {
            // Destruir todos los obstáculos visibles
            this.obstacles.forEach(obs => this.createParticles(obs.x, obs.y, '💥'));
            this.obstacles = [];
            this.showFloatingText("¡Limpieza!", this.player.x, this.player.y - 50, '#ff4500');
        } else if (powerUp.duration > 0) {
            this.activeEffects[powerUp.type] = powerUp.duration;
        }
        
        this.showFloatingText(powerUp.name, powerUp.x, powerUp.y, powerUp.color, 30);
        this.createExplosion(powerUp.x, powerUp.y, powerUp.color);
    }

    hitObstacle() {
        this.lives--;
        this.combo = 0;
        
        // Shake screen effect (simulado)
        this.screenShake = 10;
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.player.invincible = true;
            this.player.invincibleTime = 120;
            this.createParticles(this.player.x, this.player.y, '💔', '#ff0000');
            this.showFloatingText("-1 Vida", this.player.x, this.player.y - 50, '#ff0000');
        }
    }

    createParticles(x, y, emoji, color = null) {
        const count = 10;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + Math.random() * 40,
                y: y + Math.random() * 40,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                emoji: emoji,
                color: color,
                life: 40 + Math.random() * 20,
                maxLife: 60,
                opacity: 1,
                size: Math.random() * 20 + 5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 / 20) * i;
            const speed = 5 + Math.random() * 5;
            this.particles.push({
                x: x + 20,
                y: y + 20,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: color,
                emoji: null, // Partícula geométrica
                life: 50,
                maxLife: 50,
                opacity: 1,
                size: 5 + Math.random() * 5,
                rotation: 0,
                rotationSpeed: 0
            });
        }
    }

    showFloatingText(text, x, y, color = '#fff', fontSize = 24) {
        this.floatingTexts.push({
            x: x,
            y: y,
            vy: -1.5,
            text: text,
            life: 60,
            maxLife: 60,
            opacity: 1,
            color: color,
            fontSize: fontSize,
            scale: 1
        });
    }

    showLevelUp() {
        this.showFloatingText(`¡NIVEL ${this.level}!`, this.width / 2 - 50, this.height / 2, '#00ffff', 48);
        this.createExplosion(this.width / 2, this.height / 2, '#00ffff');
    }

    checkCollision(rect1, rect2) {
        const padding = 10; // Hitbox más permisiva
        return rect1.x + padding < rect2.x + rect2.width - padding &&
               rect1.x + rect1.width - padding > rect2.x + padding &&
               rect1.y + padding < rect2.y + rect2.height - padding &&
               rect1.y + rect1.height - padding > rect2.y + padding;
    }

    clampPlayer() {
        this.player.x = Math.max(0, Math.min(this.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.height - this.player.height, this.player.y));
    }

    togglePause() {
        if (!this.isPlaying) return;
        this.isPaused = !this.isPaused;
        if (this.isPaused) this.showPauseScreen();
    }

    showPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillStyle = '#ff1493';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⏸️ PAUSA', this.width / 2, this.height / 2);
    }

    async gameOver() {
        this.isPlaying = false;
        
        // Verificar Logros
        if (window.achievements) {
            if (this.score >= 1000) {
                window.achievements.unlock('galaxy_explorer');
            }
            if (this.score >= 5000) {
                window.achievements.unlock('galaxy_master');
            }
        }

        if (this.score > this.highScore) {
            this.highScore = this.score;
            if (window.db && window.db.saveGameScore) {
                await window.db.saveGameScore('galaxyLove', this.score, { level: this.level, maxCombo: this.maxCombo });
            } else {
                localStorage.setItem('galaxyLoveHighScore', this.highScore);
            }
        }
        
        this.showGameOverScreen();
    }

    showGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.font = 'bold 58px Arial';
        this.ctx.fillStyle = '#ff1493';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over 💔', this.width / 2, 100);
        
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fillText(`Puntuación: ${this.score}`, this.width / 2, 180);
        
        // Mensaje de reinicio
        const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
        this.ctx.font = 'bold 26px Arial';
        this.ctx.fillStyle = `rgba(255, 20, 147, ${0.7 + pulse * 0.3})`;
        this.ctx.fillText('Presiona ESPACIO para Reiniciar', this.width / 2, 500);
        
        if (!this.isPlaying) {
            this.gameOverAnimationId = requestAnimationFrame(() => this.showGameOverScreen());
        }
        
        // Input handler de reinicio (one-time)
        if (!this.restartHandlerAttached) {
            const restartHandler = (e) => {
                if ((e.key === ' ' || e.type === 'click') && !this.isPlaying) {
                    cancelAnimationFrame(this.gameOverAnimationId);
                    this.restartHandlerAttached = false;
                    window.removeEventListener('keydown', restartHandler);
                    this.canvas.removeEventListener('click', restartHandler);
                    this.startGame();
                } else if (e.key === 'Escape') {
                    cancelAnimationFrame(this.gameOverAnimationId);
                    this.closeGalaxyGame();
                }
            };
            window.addEventListener('keydown', restartHandler);
            this.canvas.addEventListener('click', restartHandler);
            this.restartHandlerAttached = true;
        }
    }

    closeGalaxyGame() {
        const modal = document.getElementById('galaxy-game-modal');
        if (modal) modal.classList.remove('active');
    }

    draw() {
        // Fondo con efecto de "trail" suave si hay shake
        this.ctx.fillStyle = '#0a0a0f';
        if (this.screenShake > 0) {
            const dx = (Math.random() - 0.5) * this.screenShake;
            const dy = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(dx, dy);
            this.screenShake *= 0.9;
            if (this.screenShake < 0.5) this.screenShake = 0;
        }
        
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.drawStars();
        
        if (!this.isPlaying) return;
        
        // Dibujar estela del jugador
        this.player.trail.forEach(t => {
            this.ctx.font = `${this.player.width * 0.8}px Arial`;
            this.ctx.globalAlpha = t.alpha * 0.5;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.player.emoji, t.x + this.player.width/2, t.y + this.player.height/2);
        });
        this.ctx.globalAlpha = 1;

        // Elementos
        this.drawHearts();
        this.drawMessages();
        this.drawObstacles();
        this.drawPowerUps();
        this.drawParticles();
        this.drawPlayer();
        this.drawFloatingTexts();
        this.drawUI();
        
        // Reset transform
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawStars() {
        this.stars.forEach(star => {
            this.ctx.globalAlpha = 0.8 + Math.sin(star.twinkle) * 0.2;
            this.ctx.fillStyle = star.color;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }

    drawHearts() {
        this.hearts.forEach(heart => {
            this.ctx.save();
            this.ctx.translate(heart.x + heart.width / 2, heart.y + heart.height / 2);
            this.ctx.rotate(heart.rotation);
            this.ctx.scale(heart.scale, heart.scale);
            
            // Brillo
            this.ctx.shadowColor = '#ff69b4';
            this.ctx.shadowBlur = 15;
            
            this.ctx.font = `${heart.width}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(heart.emoji, 0, 0);
            this.ctx.restore();
        });
    }

    drawMessages() {
        this.messages.forEach(message => {
            this.ctx.save();
            this.ctx.shadowColor = message.color;
            this.ctx.shadowBlur = message.glow;
            this.ctx.fillStyle = message.color;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(message.text, message.x + message.width / 2, message.y + message.height / 2);
            this.ctx.restore();
        });
    }

    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.ctx.save();
            this.ctx.translate(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
            this.ctx.rotate(obstacle.rotation);
            this.ctx.font = `${obstacle.width}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(obstacle.emoji, 0, 0);
            this.ctx.restore();
        });
    }

    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            const scale = 1 + Math.sin(powerUp.pulse) * 0.2;
            this.ctx.save();
            this.ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
            this.ctx.scale(scale, scale);
            this.ctx.shadowColor = powerUp.color;
            this.ctx.shadowBlur = 20;
            this.ctx.font = `${powerUp.width}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(powerUp.emoji, 0, 0);
            this.ctx.restore();
        });
    }

    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        this.ctx.rotate(this.player.angle);

        // Efecto Escudo
        if (this.activeEffects.shield > 0) {
            this.ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 + Math.sin(this.frameCount * 0.2) * 0.3})`;
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.player.width * 0.8, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Efecto Imán
        if (this.activeEffects.magnet > 0) {
            this.ctx.strokeStyle = `rgba(255, 215, 0, 0.3)`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 150, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Render Jugador
        if (!this.player.invincible || Math.floor(this.frameCount / 5) % 2 === 0) {
            this.ctx.font = `${this.player.width}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.player.emoji, 0, 0);
        }
        
        this.ctx.restore();
    }

    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            
            if (p.emoji) {
                this.ctx.font = `${p.size}px Arial`;
                this.ctx.fillText(p.emoji, 0, 0);
            } else {
                this.ctx.fillStyle = p.color || '#fff';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        });
    }

    drawFloatingTexts() {
        this.floatingTexts.forEach(t => {
            this.ctx.save();
            this.ctx.globalAlpha = t.opacity;
            this.ctx.translate(t.x, t.y);
            this.ctx.scale(t.scale, t.scale);
            this.ctx.font = `bold ${t.fontSize}px Arial`;
            this.ctx.fillStyle = t.color;
            this.ctx.shadowColor = '#000';
            this.ctx.shadowBlur = 4;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(t.text, 0, 0);
            this.ctx.restore();
        });
    }

    drawUI() {
        // Barra superior
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.width, 50);
        this.ctx.fillStyle = 'rgba(255, 20, 147, 0.5)';
        this.ctx.fillRect(0, 48, this.width, 2);

        // Score
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`💎 ${this.score}`, 20, 34);

        // Nivel
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillText(`NIVEL ${this.level}`, this.width / 2, 34);

        // Vidas
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = '#ff1493';
        let livesStr = '';
        for (let i = 0; i < this.lives; i++) livesStr += '❤️';
        this.ctx.fillText(livesStr, this.width - 20, 34);

        // Combo bar
        if (this.combo > 1) {
            const barWidth = 200;
            const fillWidth = (this.comboTime / 150) * barWidth;
            
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.fillRect(this.width/2 - barWidth/2, 60, barWidth, 10);
            
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillRect(this.width/2 - barWidth/2, 60, fillWidth, 10);
            
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${this.combo}x COMBO`, this.width/2, 95);
        }

        // Efectos activos (iconos)
        let effectX = 20;
        const effectY = 80;
        
        for (const effect in this.activeEffects) {
            if (this.activeEffects[effect] > 0) {
                const type = this.powerUpTypes.find(p => p.type === effect);
                if (type) {
                    this.ctx.font = '24px Arial';
                    this.ctx.fillText(type.emoji, effectX, effectY);
                    
                    // Barra de duración pequeña debajo del icono
                    const maxDuration = type.duration;
                    const pct = this.activeEffects[effect] / maxDuration;
                    
                    this.ctx.fillStyle = '#333';
                    this.ctx.fillRect(effectX - 10, effectY + 5, 30, 4);
                    this.ctx.fillStyle = type.color;
                    this.ctx.fillRect(effectX - 10, effectY + 5, 30 * pct, 4);
                    
                    effectX += 50;
                }
            }
        }
    }
}

// Inicialización global
let galaxyGame = null;

function startGalaxyLoveGame() {
    const modal = document.getElementById('galaxy-game-modal');
    if (modal) {
        modal.classList.add('active');
        modal.classList.add('full-screen'); // Añadir clase full-screen
        
        // Forzar reflow para asegurar que el navegador registre el cambio de clase antes de init
        void modal.offsetWidth; 
        
        if (!galaxyGame) galaxyGame = new GalaxyLoveGame();
        
        // Pequeño delay para asegurar que el modal está visible y tiene dimensiones
        setTimeout(() => galaxyGame.init('galaxy-game-container'), 100);
    }
}

function closeGalaxyGame() {
    const modal = document.getElementById('galaxy-game-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.classList.remove('full-screen'); // Quitar clase
        if (galaxyGame) galaxyGame.isPlaying = false;
    }
}

window.startGalaxyLoveGame = startGalaxyLoveGame;
window.closeGalaxyGame = closeGalaxyGame;
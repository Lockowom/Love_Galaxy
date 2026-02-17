// ================================================
// GALAXIA DEL AMOR - JUEGO INTERACTIVO COMPLETO
// ================================================

class GalaxyLoveGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = 800;
        this.height = 600;
        
        // Estado del juego
        this.isPlaying = false;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.highScore = parseInt(localStorage.getItem('galaxyLoveHighScore')) || 0;
        
        // Jugador (nave/corazón)
        this.player = {
            x: 0,
            y: 0,
            width: 60,
            height: 60,
            speed: 5,
            emoji: '💖',
            invincible: false,
            invincibleTime: 0
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
        
        // Configuración
        this.heartSpawnRate = 60;
        this.messageSpawnRate = 180;
        this.obstacleSpawnRate = 120;
        this.powerUpSpawnRate = 300;
        
        // Mensajes de amor
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
            "Eres Mi Paraíso 🏝️", "Te Extraño 😢", "Eres Hermosa 🌺"
        ];
        
        // Power-ups
        this.powerUpTypes = [
            { type: 'shield', emoji: '🛡️', name: 'Escudo', duration: 5000 },
            { type: 'magnet', emoji: '🧲', name: 'Imán', duration: 7000 },
            { type: 'multiplier', emoji: '✖️2️⃣', name: 'x2 Puntos', duration: 10000 },
            { type: 'slow', emoji: '🐌', name: 'Cámara Lenta', duration: 5000 },
            { type: 'life', emoji: '❤️', name: 'Vida Extra', duration: 0 }
        ];
        
        // Efectos activos
        this.activeEffects = {
            shield: false,
            magnet: false,
            multiplier: false,
            slowMotion: false
        };
        
        // Contadores
        this.frameCount = 0;
        this.gameTime = 0;
        
        // Combo
        this.combo = 0;
        this.comboTime = 0;
        this.maxCombo = 0;
    }

    init(containerId) {
        // Crear canvas
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.cssText = `
            border: 3px solid var(--primary-color);
            border-radius: 15px;
            background: #000;
            box-shadow: 0 0 30px rgba(255, 20, 147, 0.5);
        `;
        
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        // Inicializar jugador
        this.player.x = this.width / 2 - this.player.width / 2;
        this.player.y = this.height - 100;
        
        // Crear estrellas de fondo
        this.createStars();
        
        // Event listeners
        this.setupControls();
        
        // Mostrar menú inicial
        this.showStartScreen();
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
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isPlaying && !this.isPaused) {
                const rect = this.canvas.getBoundingClientRect();
                this.player.x = e.clientX - rect.left - this.player.width / 2;
                this.player.y = e.clientY - rect.top - this.player.height / 2;
                this.clampPlayer();
            }
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.isPlaying && !this.isPaused) {
                e.preventDefault();
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.player.x = touch.clientX - rect.left - this.player.width / 2;
                this.player.y = touch.clientY - rect.top - this.player.height / 2;
                this.clampPlayer();
            }
        });
    }

    createStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random()
            });
        }
    }

    showStartScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Título
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillStyle = '#ff1493';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('💫 Galaxia del Amor 💫', this.width / 2, 100);
        
        // Instrucciones
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Navega por la galaxia y captura corazones', this.width / 2, 180);
        this.ctx.fillText('y mensajes de amor', this.width / 2, 210);
        
        // Controles
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillStyle = '#ff69b4';
        this.ctx.fillText('Controles:', this.width / 2, 270);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('⌨️  Flechas o WASD para mover', this.width / 2, 310);
        this.ctx.fillText('🖱️  Mouse para mover', this.width / 2, 340);
        this.ctx.fillText('⏸️  P para pausar', this.width / 2, 370);
        
        // Power-ups
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = '#ff69b4';
        this.ctx.fillText('Power-ups:', this.width / 2, 420);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('🛡️ Escudo  🧲 Imán  ✖️2️⃣ x2 Puntos  ❤️ Vida Extra', this.width / 2, 450);
        
        // High Score
        if (this.highScore > 0) {
            this.ctx.font = 'bold 22px Arial';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillText(`🏆 Récord: ${this.highScore}`, this.width / 2, 500);
        }
        
        // Botón start
        this.ctx.font = 'bold 26px Arial';
        this.ctx.fillStyle = '#ff1493';
        this.ctx.fillText('Presiona ESPACIO o Click para Jugar', this.width / 2, 560);
        
        // Esperar input
        const startHandler = (e) => {
            if (e.key === ' ' || e.type === 'click') {
                window.removeEventListener('keydown', startHandler);
                this.canvas.removeEventListener('click', startHandler);
                this.startGame();
            }
        };
        
        window.addEventListener('keydown', startHandler);
        this.canvas.addEventListener('click', startHandler);
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
        
        this.activeEffects = {
            shield: false,
            magnet: false,
            multiplier: false,
            slowMotion: false
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
        
        // Actualizar nivel
        const newLevel = Math.floor(this.score / 500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.showLevelUp();
        }
        
        // Mover jugador con teclado
        const speed = this.player.speed;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.player.x -= speed;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.player.x += speed;
        }
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
            this.player.y -= speed;
        }
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
            this.player.y += speed;
        }
        
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
        this.stars.forEach(star => {
            star.y += star.speed * (this.activeEffects.slowMotion ? 0.5 : 1);
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        });
    }

    spawnElements() {
        const speedMod = this.activeEffects.slowMotion ? 2 : 1;
        
        // Spawn corazones
        if (this.frameCount % Math.floor(this.heartSpawnRate / this.level * speedMod) === 0) {
            this.spawnHeart();
        }
        
        // Spawn mensajes
        if (this.frameCount % Math.floor(this.messageSpawnRate * speedMod) === 0) {
            this.spawnMessage();
        }
        
        // Spawn obstáculos
        if (this.frameCount % Math.floor(this.obstacleSpawnRate / Math.sqrt(this.level) * speedMod) === 0) {
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
            speed: 1 + this.level * 0.3,
            emoji: heartTypes[Math.floor(Math.random() * heartTypes.length)],
            points: 10,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            scale: 1,
            pulse: 0
        });
    }

    spawnMessage() {
        const message = this.loveMessages[Math.floor(Math.random() * this.loveMessages.length)];
        this.messages.push({
            x: Math.random() * (this.width - 150),
            y: -50,
            width: 150,
            height: 50,
            speed: 0.8 + this.level * 0.2,
            text: message,
            points: 50,
            color: `hsl(${Math.random() * 60 + 300}, 100%, 70%)`,
            glow: Math.random() * 10
        });
    }

    spawnObstacle() {
        const obstacleTypes = ['💔', '☁️', '🌑', '⚡'];
        this.obstacles.push({
            x: Math.random() * (this.width - 50),
            y: -50,
            width: 50,
            height: 50,
            speed: 1.5 + this.level * 0.4,
            emoji: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)],
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }

    spawnPowerUp() {
        const powerUp = this.powerUpTypes[Math.floor(Math.random() * this.powerUpTypes.length)];
        this.powerUps.push({
            x: Math.random() * (this.width - 40),
            y: -40,
            width: 40,
            height: 40,
            speed: 1,
            type: powerUp.type,
            emoji: powerUp.emoji,
            name: powerUp.name,
            duration: powerUp.duration,
            pulse: 0
        });
    }

    updateHearts() {
        const speedMod = this.activeEffects.slowMotion ? 0.5 : 1;
        
        this.hearts = this.hearts.filter(heart => {
            heart.y += heart.speed * speedMod;
            heart.rotation += heart.rotationSpeed;
            heart.pulse += 0.1;
            heart.scale = 1 + Math.sin(heart.pulse) * 0.1;
            
            // Efecto imán
            if (this.activeEffects.magnet) {
                const dx = this.player.x + this.player.width / 2 - (heart.x + heart.width / 2);
                const dy = this.player.y + this.player.height / 2 - (heart.y + heart.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    heart.x += dx * 0.05;
                    heart.y += dy * 0.05;
                }
            }
            
            // Colisión con jugador
            if (this.checkCollision(this.player, heart)) {
                this.collectHeart(heart);
                return false;
            }
            
            return heart.y < this.height + 50;
        });
    }

    updateMessages() {
        const speedMod = this.activeEffects.slowMotion ? 0.5 : 1;
        
        this.messages = this.messages.filter(message => {
            message.y += message.speed * speedMod;
            message.glow = (message.glow + 0.2) % 20;
            
            // Efecto imán
            if (this.activeEffects.magnet) {
                const dx = this.player.x + this.player.width / 2 - (message.x + message.width / 2);
                const dy = this.player.y + this.player.height / 2 - (message.y + message.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 250) {
                    message.x += dx * 0.03;
                    message.y += dy * 0.03;
                }
            }
            
            // Colisión con jugador
            if (this.checkCollision(this.player, message)) {
                this.collectMessage(message);
                return false;
            }
            
            return message.y < this.height + 50;
        });
    }

    updateObstacles() {
        const speedMod = this.activeEffects.slowMotion ? 0.5 : 1;
        
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.y += obstacle.speed * speedMod;
            obstacle.rotation += obstacle.rotationSpeed;
            
            // Colisión con jugador
            if (!this.player.invincible && !this.activeEffects.shield && 
                this.checkCollision(this.player, obstacle)) {
                this.hitObstacle();
                return false;
            }
            
            return obstacle.y < this.height + 50;
        });
    }

    updatePowerUps() {
        const speedMod = this.activeEffects.slowMotion ? 0.5 : 1;
        
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.y += powerUp.speed * speedMod;
            powerUp.pulse += 0.15;
            
            // Colisión con jugador
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
            particle.life--;
            particle.opacity -= 0.02;
            
            return particle.life > 0 && particle.opacity > 0;
        });
    }

    updateEffects() {
        // Actualizar duración de efectos
        for (const effect in this.activeEffects) {
            if (this.activeEffects[effect] && typeof this.activeEffects[effect] === 'number') {
                this.activeEffects[effect]--;
                if (this.activeEffects[effect] <= 0) {
                    this.activeEffects[effect] = false;
                }
            }
        }
    }

    collectHeart(heart) {
        const points = heart.points * (this.activeEffects.multiplier ? 2 : 1);
        this.score += points;
        
        // Combo
        this.combo++;
        this.comboTime = 120; // 2 segundos
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        
        // Bonus de combo
        if (this.combo > 5) {
            this.score += this.combo * 2;
        }
        
        // Partículas
        this.createParticles(heart.x + heart.width / 2, heart.y + heart.height / 2, heart.emoji);
        
        // Sonido visual
        this.flashScreen('#ff1493', 0.1);
    }

    collectMessage(message) {
        const points = message.points * (this.activeEffects.multiplier ? 2 : 1);
        this.score += points;
        
        // Combo grande
        this.combo += 3;
        this.comboTime = 120;
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        
        // Partículas
        this.createParticles(message.x + message.width / 2, message.y + message.height / 2, '✨');
        
        // Mostrar mensaje
        this.showFloatingText(message.text, message.x + message.width / 2, message.y);
        
        // Flash
        this.flashScreen('#ffd700', 0.2);
    }

    collectPowerUp(powerUp) {
        if (powerUp.type === 'life') {
            this.lives = Math.min(this.lives + 1, 5);
        } else if (powerUp.duration > 0) {
            this.activeEffects[powerUp.type] = powerUp.duration;
        }
        
        // Mostrar nombre del power-up
        this.showFloatingText(`${powerUp.emoji} ${powerUp.name}!`, powerUp.x + powerUp.width / 2, powerUp.y);
        
        // Partículas
        this.createParticles(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUp.emoji);
        
        // Flash
        this.flashScreen('#00ff00', 0.15);
    }

    hitObstacle() {
        this.lives--;
        this.combo = 0;
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Invencibilidad temporal
            this.player.invincible = true;
            this.player.invincibleTime = 120; // 2 segundos
            
            // Flash rojo
            this.flashScreen('#ff0000', 0.3);
            
            // Partículas de daño
            this.createParticles(this.player.x + this.player.width / 2, 
                                this.player.y + this.player.height / 2, '💥');
        }
    }

    createParticles(x, y, emoji) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                emoji: emoji,
                life: 60,
                opacity: 1,
                size: Math.random() * 20 + 10
            });
        }
    }

    showFloatingText(text, x, y) {
        this.particles.push({
            x: x,
            y: y,
            vx: 0,
            vy: -2,
            text: text,
            life: 120,
            opacity: 1,
            size: 24,
            color: '#ffd700'
        });
    }

    flashScreen(color, opacity) {
        this.screenFlash = {
            color: color,
            opacity: opacity,
            duration: 10
        };
    }

    showLevelUp() {
        this.showFloatingText(`¡Nivel ${this.level}! 🎉`, this.width / 2, this.height / 2);
        this.flashScreen('#00ffff', 0.2);
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    clampPlayer() {
        this.player.x = Math.max(0, Math.min(this.width - this.player.width, this.player.x));
        this.player.y = Math.max(0, Math.min(this.height - this.player.height, this.player.y));
    }

    togglePause() {
        if (!this.isPlaying) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.showPauseScreen();
        }
    }

    showPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillStyle = '#ff1493';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⏸️ PAUSA', this.width / 2, this.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('Presiona P para continuar', this.width / 2, this.height / 2 + 50);
    }

    gameOver() {
        this.isPlaying = false;
        
        // Guardar high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('galaxyLoveHighScore', this.highScore);
        }
        
        // Mostrar pantalla de game over
        this.showGameOverScreen();
    }

    showGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Título
        this.ctx.font = 'bold 58px Arial';
        this.ctx.fillStyle = '#ff1493';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over 💔', this.width / 2, 100);
        
        // Estadísticas
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fillText(`Puntuación: ${this.score}`, this.width / 2, 180);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`Nivel Alcanzado: ${this.level}`, this.width / 2, 230);
        this.ctx.fillText(`Combo Máximo: ${this.maxCombo}`, this.width / 2, 270);
        this.ctx.fillText(`Tiempo: ${Math.floor(this.gameTime / 60)}s`, this.width / 2, 310);
        
        // High score
        if (this.score === this.highScore && this.score > 0) {
            this.ctx.font = 'bold 28px Arial';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillText('🏆 ¡NUEVO RÉCORD! 🏆', this.width / 2, 370);
        } else if (this.highScore > 0) {
            this.ctx.font = '22px Arial';
            this.ctx.fillStyle = '#ff69b4';
            this.ctx.fillText(`Récord: ${this.highScore}`, this.width / 2, 370);
        }
        
        // Mensaje romántico
        const endMessages = [
            'El amor nunca se rinde 💕',
            'Cada intento es por amor 💖',
            'Tu amor vale más que mil puntos 💗',
            'Eres mi victoria 💓',
            'Juntos somos invencibles 💞'
        ];
        const randomMsg = endMessages[Math.floor(Math.random() * endMessages.length)];
        
        this.ctx.font = 'italic 20px Arial';
        this.ctx.fillStyle = '#ff69b4';
        this.ctx.fillText(randomMsg, this.width / 2, 430);
        
        // Botones
        this.ctx.font = 'bold 26px Arial';
        this.ctx.fillStyle = '#ff1493';
        this.ctx.fillText('Presiona ESPACIO o Click para Reiniciar', this.width / 2, 520);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText('ESC para salir', this.width / 2, 560);
        
        // Esperar input
        const restartHandler = (e) => {
            if (e.key === ' ' || e.type === 'click') {
                window.removeEventListener('keydown', restartHandler);
                this.canvas.removeEventListener('click', restartHandler);
                this.startGame();
            } else if (e.key === 'Escape') {
                window.removeEventListener('keydown', restartHandler);
                this.canvas.removeEventListener('click', restartHandler);
                this.exitGame();
            }
        };
        
        window.addEventListener('keydown', restartHandler);
        this.canvas.addEventListener('click', restartHandler);
    }

    exitGame() {
        const modal = document.getElementById('galaxy-game-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    draw() {
        // Clear
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Estrellas
        this.drawStars();
        
        if (!this.isPlaying) return;
        
        // Elementos del juego
        this.drawHearts();
        this.drawMessages();
        this.drawObstacles();
        this.drawPowerUps();
        this.drawPlayer();
        this.drawParticles();
        
        // UI
        this.drawUI();
        
        // Flash de pantalla
        if (this.screenFlash && this.screenFlash.duration > 0) {
            this.ctx.fillStyle = this.screenFlash.color;
            this.ctx.globalAlpha = this.screenFlash.opacity * (this.screenFlash.duration / 10);
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.globalAlpha = 1;
            this.screenFlash.duration--;
        }
        
        // Pantalla de pausa
        if (this.isPaused) {
            this.showPauseScreen();
        }
    }

    drawStars() {
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    drawHearts() {
        this.hearts.forEach(heart => {
            this.ctx.save();
            this.ctx.translate(heart.x + heart.width / 2, heart.y + heart.height / 2);
            this.ctx.rotate(heart.rotation);
            this.ctx.scale(heart.scale, heart.scale);
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
            
            // Glow effect
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
            
            // Glow
            this.ctx.shadowColor = '#00ff00';
            this.ctx.shadowBlur = 15;
            
            this.ctx.font = `${powerUp.width}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(powerUp.emoji, 0, 0);
            
            this.ctx.restore();
        });
    }

    drawPlayer() {
        this.ctx.save();
        
        // Efectos visuales del jugador
        if (this.activeEffects.shield) {
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(this.player.x + this.player.width / 2, 
                        this.player.y + this.player.height / 2, 
                        this.player.width, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        if (this.activeEffects.magnet) {
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(this.player.x + this.player.width / 2, 
                        this.player.y + this.player.height / 2, 
                        150, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        // Parpadeo si está invencible
        if (!this.player.invincible || this.frameCount % 10 < 5) {
            this.ctx.font = `${this.player.width}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.player.emoji, 
                            this.player.x + this.player.width / 2, 
                            this.player.y + this.player.height / 2);
        }
        
        this.ctx.restore();
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            
            if (particle.text) {
                this.ctx.font = `bold ${particle.size}px Arial`;
                this.ctx.fillStyle = particle.color;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(particle.text, particle.x, particle.y);
            } else {
                this.ctx.font = `${particle.size}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.fillText(particle.emoji, particle.x, particle.y);
            }
            
            this.ctx.restore();
        });
    }

    drawUI() {
        // Fondo semi-transparente para UI
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.width, 45);
        
        // Score
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`💰 ${this.score}`, 10, 28);
        
        // Nivel
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillText(`⭐ Nivel ${this.level}`, 150, 28);
        
        // Vidas
        this.ctx.fillStyle = '#ff1493';
        this.ctx.textAlign = 'right';
        let heartsText = '';
        for (let i = 0; i < this.lives; i++) {
            heartsText += '❤️';
        }
        this.ctx.fillText(heartsText, this.width - 10, 28);
        
        // Combo
        if (this.combo > 2) {
            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`COMBO x${this.combo}! 🔥`, this.width / 2, 70);
        }
        
        // Efectos activos
        let effectY = 80;
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        
        if (this.activeEffects.shield) {
            this.ctx.fillStyle = '#00ffff';
            this.ctx.fillText(`🛡️ Escudo: ${Math.ceil(this.activeEffects.shield / 60)}s`, 10, effectY);
            effectY += 25;
        }
        if (this.activeEffects.magnet) {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillText(`🧲 Imán: ${Math.ceil(this.activeEffects.magnet / 60)}s`, 10, effectY);
            effectY += 25;
        }
        if (this.activeEffects.multiplier) {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillText(`✖️2️⃣ x2: ${Math.ceil(this.activeEffects.multiplier / 60)}s`, 10, effectY);
            effectY += 25;
        }
        if (this.activeEffects.slowMotion) {
            this.ctx.fillStyle = '#ff69b4';
            this.ctx.fillText(`🐌 Lento: ${Math.ceil(this.activeEffects.slowMotion / 60)}s`, 10, effectY);
        }
    }
}

// ================================================
// INICIALIZACIÓN DEL JUEGO
// ================================================

let galaxyGame = null;

function startGalaxyLoveGame() {
    const modal = document.getElementById('galaxy-game-modal');
    if (modal) {
        modal.classList.add('active');
        
        if (!galaxyGame) {
            galaxyGame = new GalaxyLoveGame();
        }
        
        setTimeout(() => {
            galaxyGame.init('galaxy-game-container');
        }, 100);
    }
}

function closeGalaxyGame() {
    const modal = document.getElementById('galaxy-game-modal');
    if (modal) {
        modal.classList.remove('active');
        if (galaxyGame) {
            galaxyGame.isPlaying = false;
        }
    }
}

// Exportar para uso global
window.startGalaxyLoveGame = startGalaxyLoveGame;
window.closeGalaxyGame = closeGalaxyGame;

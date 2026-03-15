class GalaxyVisualizer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.isActive = false;
        this.particles = [];
        this.baseRadius = 50;
        
        // Configuración del canvas
        this.canvas.id = 'galaxy-visualizer';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            background: radial-gradient(circle at center, #1a0b2e 0%, #000000 100%);
        `;
        document.body.prepend(this.canvas);
        
        // Eventos
        window.addEventListener('resize', () => this.resize());
        this.resize();
        this.initParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    initParticles() {
        this.particles = [];
        const particleCount = 150;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                angle: Math.random() * Math.PI * 2,
                radius: Math.random() * 300 + 50,
                speed: Math.random() * 0.005 + 0.002,
                color: `hsl(${Math.random() * 60 + 300}, 70%, 70%)` // Rosas y morados
            });
        }
    }

    connect(audioElement) {
        if (this.audioContext) return; // Ya conectado

        try {
            // Contexto de Audio
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Analizador
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256; // Resolución (barras)
            
            // Conectar fuente
            this.source = this.audioContext.createMediaElementSource(audioElement);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Buffer de datos
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            this.isActive = true;
            this.animate();
            console.log('🌌 Visualizador de Galaxia Conectado');
        } catch (e) {
            console.error('Error al conectar visualizador:', e);
        }
    }

    animate() {
        if (!this.isActive) return;
        requestAnimationFrame(() => this.animate());

        // Obtener datos de frecuencia
        this.analyser.getByteFrequencyData(this.dataArray);

        // Limpiar canvas con rastro
        this.ctx.fillStyle = 'rgba(10, 5, 20, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Calcular promedio de bajos (Bass)
        let bass = 0;
        for (let i = 0; i < 10; i++) {
            bass += this.dataArray[i];
        }
        bass = bass / 10;
        
        // Efecto de pulso en el radio base
        const pulse = (bass / 255) * 50; 

        // Dibujar Núcleo de la Galaxia
        const gradient = this.ctx.createRadialGradient(this.centerX, this.centerY, 10, this.centerX, this.centerY, this.baseRadius + pulse * 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.2, 'rgba(255, 20, 147, 0.6)');
        gradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.baseRadius + pulse * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Dibujar Ondas Circulares (Frecuencias medias/altas)
        this.ctx.lineWidth = 2;
        for (let i = 0; i < this.dataArray.length; i += 5) {
            const value = this.dataArray[i];
            const radius = this.baseRadius + i * 2 + pulse;
            const alpha = value / 255;
            
            this.ctx.strokeStyle = `hsla(${300 + i}, 70%, 60%, ${alpha * 0.5})`;
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Partículas Estelares (reaccionan a la música)
        this.particles.forEach((p, i) => {
            // Movimiento orbital
            p.angle += p.speed + (bass / 10000); // Acelerar con el bajo
            
            // Posición
            const r = p.radius + (this.dataArray[i % 50] / 2); // Radio varía con frecuencia
            const x = this.centerX + Math.cos(p.angle) * r;
            const y = this.centerY + Math.sin(p.angle) * r;

            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// Inicializar globalmente
window.galaxyVisualizer = new GalaxyVisualizer();

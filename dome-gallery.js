class DomeGallery {
    constructor(containerId, images, options = {}) {
        this.container = document.getElementById(containerId);
        this.images = images;
        this.options = {
            radius: options.radius || 300,
            itemSize: options.itemSize || 100,
            autoRotateSpeed: options.autoRotateSpeed || 0.2,
            ...options
        };
        
        this.items = [];
        this.rotation = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.isDragging = false;
        this.lastMouse = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // Limpiar contenedor
        this.container.innerHTML = '';
        this.container.classList.add('dome-gallery-container');
        
        // Crear rotador
        this.rotator = document.createElement('div');
        this.rotator.className = 'dome-rotator';
        this.container.appendChild(this.rotator);
        
        // Crear items distribuidos en esfera
        this.createItems();
        
        // Eventos
        this.setupEvents();
        
        // Iniciar loop de animación
        this.animate();
    }

    createItems() {
        const phi = Math.PI * (3 - Math.sqrt(5)); // Ángulo áureo
        const n = this.images.length;
        
        this.images.forEach((imgData, i) => {
            const item = document.createElement('div');
            item.className = 'dome-item';
            
            // Imagen
            const img = document.createElement('img');
            img.src = imgData.url || imgData.src;
            img.alt = imgData.caption || 'Foto';
            
            // Evento click para ver en grande (usando la función existente del proyecto)
            item.onclick = () => {
                if (window.viewPhotoFullscreen && imgData.id) {
                    window.viewPhotoFullscreen(imgData.id);
                }
            };
            
            item.appendChild(img);
            this.rotator.appendChild(item);
            
            // Calcular posición esférica (Fibonacci Sphere)
            const y = 1 - (i / (n - 1)) * 2; // y va de 1 a -1
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;
            
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            
            // Guardar posición base vectorizada
            this.items.push({
                element: item,
                vector: { x, y, z }
            });
        });
    }

    setupEvents() {
        // Mouse / Touch
        this.container.addEventListener('mousedown', e => this.handleStart(e.clientX, e.clientY));
        this.container.addEventListener('touchstart', e => this.handleStart(e.touches[0].clientX, e.touches[0].clientY));
        
        window.addEventListener('mousemove', e => this.handleMove(e.clientX, e.clientY));
        window.addEventListener('touchmove', e => this.handleMove(e.touches[0].clientX, e.touches[0].clientY));
        
        window.addEventListener('mouseup', () => this.isDragging = false);
        window.addEventListener('touchend', () => this.isDragging = false);
    }

    handleStart(x, y) {
        this.isDragging = true;
        this.lastMouse = { x, y };
    }

    handleMove(x, y) {
        if (!this.isDragging) return;
        
        const deltaX = x - this.lastMouse.x;
        const deltaY = y - this.lastMouse.y;
        
        this.targetRotation.y += deltaX * 0.005;
        this.targetRotation.x -= deltaY * 0.005;
        
        this.lastMouse = { x, y };
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Suavizar rotación
        if (!this.isDragging) {
            this.targetRotation.y += this.options.autoRotateSpeed * 0.01;
        }
        
        this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.1;
        this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.1;
        
        // Matriz de rotación
        const cosX = Math.cos(this.rotation.x);
        const sinX = Math.sin(this.rotation.x);
        const cosY = Math.cos(this.rotation.y);
        const sinY = Math.sin(this.rotation.y);
        
        this.items.forEach(item => {
            const v = item.vector;
            
            // Rotar vector
            // Rotación Y
            let rx = v.x * cosY - v.z * sinY;
            let rz = v.x * sinY + v.z * cosY;
            
            // Rotación X
            let ry = v.y * cosX - rz * sinX;
            rz = v.y * sinX + rz * cosX;
            
            // Proyectar
            const scale = this.options.radius;
            const px = rx * scale;
            const py = ry * scale;
            const pz = rz * scale; // Profundidad para z-index y escala
            
            // Factor de escala visual basado en profundidad (perspectiva fake)
            const perspective = 1000;
            const distance = perspective + pz;
            const visualScale = Math.max(0.1, perspective / distance);
            
            // Aplicar transformación
            item.element.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) scale(${visualScale})`;
            item.element.style.zIndex = Math.floor(pz);
            item.element.style.opacity = Math.max(0.2, (pz + scale) / (2 * scale)); // Desvanecer atrás
        });
    }
}

// Inicializar cuando se carguen las fotos
window.initDomeGallery = async function() {
    const container = document.getElementById('dome-gallery-view');
    if (!container) return;
    
    try {
        const photos = await db.getPhotos();
        if (photos.length > 0) {
            new DomeGallery('dome-gallery-view', photos, {
                radius: window.innerWidth < 768 ? 150 : 300
            });
        } else {
            container.innerHTML = '<p class="text-center" style="color: #aaa; margin-top: 50px;">Sube fotos para verlas en la cúpula mágica ✨</p>';
        }
    } catch (e) {
        console.error("Error iniciando Dome Gallery:", e);
    }
};

window.switchGalleryView = function(view) {
    const gridView = document.getElementById('gallery-grid-view');
    const domeView = document.getElementById('dome-gallery-wrapper');
    const btns = document.querySelectorAll('.view-btn');
    
    // Actualizar botones
    btns.forEach(btn => {
        if (btn.getAttribute('onclick').includes(view)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    if (view === 'grid') {
        gridView.classList.remove('hidden');
        domeView.classList.add('hidden');
    } else {
        gridView.classList.add('hidden');
        domeView.classList.remove('hidden');
        // Reinicializar cúpula si es necesario o si es la primera vez
        if (!window.domeInitialized) {
            window.initDomeGallery();
            window.domeInitialized = true;
        }
    }
};

class DomeGallery {
    constructor(containerId, images, options = {}) {
        this.container = document.getElementById(containerId);
        this.images = images;
        this.options = {
            radius: options.radius || 250,
            autoRotateSpeed: options.autoRotateSpeed || 0.2,
            ...options
        };
        
        this.items = [];
        this.rotation = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.isDragging = false;
        this.lastMouse = { x: 0, y: 0 };
        this.autoRotate = true;
        
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // Limpiar contenedor y establecer estilos base
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.perspective = '1000px';
        this.container.style.overflow = 'hidden';
        this.container.style.display = 'flex';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        this.container.style.cursor = 'grab';
        
        // Crear el rotador (el objeto que gira)
        this.rotator = document.createElement('div');
        this.rotator.className = 'dome-rotator';
        this.rotator.style.position = 'absolute';
        this.rotator.style.transformStyle = 'preserve-3d';
        this.rotator.style.width = '0';
        this.rotator.style.height = '0';
        
        this.container.appendChild(this.rotator);
        
        // Crear items distribuidos en esfera (Algoritmo Fibonacci Sphere)
        this.createItems();
        
        // Eventos
        this.setupEvents();
        
        // Iniciar loop de animación
        this.animate();
    }

    createItems() {
        const phi = Math.PI * (3 - Math.sqrt(5)); // Ángulo áureo
        const n = this.images.length;
        const radius = this.options.radius;
        
        this.images.forEach((imgData, i) => {
            const item = document.createElement('div');
            item.className = 'dome-item';
            
            // Estilos del item
            item.style.position = 'absolute';
            item.style.width = '100px';
            item.style.height = '100px';
            item.style.left = '-50px';
            item.style.top = '-50px';
            item.style.transformStyle = 'preserve-3d';
            item.style.backfaceVisibility = 'hidden';
            
            // Imagen
            const img = document.createElement('img');
            img.src = imgData.url || imgData.src || imgData.dataUrl;
            img.alt = imgData.caption || 'Foto';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '10px';
            img.style.border = '2px solid var(--primary-color)';
            img.style.boxShadow = '0 0 10px rgba(255,20,147,0.5)';
            img.style.pointerEvents = 'none'; // Para que el click lo capture el div padre
            
            // Evento click para ver en grande
            item.onclick = (e) => {
                e.stopPropagation(); // Evitar arrastre
                if (window.viewPhotoFullscreen && imgData.id) {
                    window.viewPhotoFullscreen(imgData.id);
                }
            };
            
            item.appendChild(img);
            this.rotator.appendChild(item);
            
            // Calcular posición esférica
            const y = 1 - (i / (n - 1)) * 2; // y va de 1 a -1
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;
            
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            
            // Guardar posición base normalizada (vector unitario)
            this.items.push({
                element: item,
                vector: { x, y, z }
            });
        });
    }

    setupEvents() {
        // Mouse / Touch Start
        const onStart = (x, y) => {
            this.isDragging = true;
            this.autoRotate = false;
            this.lastMouse = { x, y };
            this.container.style.cursor = 'grabbing';
        };

        this.container.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
        this.container.addEventListener('touchstart', e => {
            e.preventDefault(); // Evitar scroll en móvil
            onStart(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        
        // Mouse / Touch Move
        const onMove = (x, y) => {
            if (!this.isDragging) return;
            
            const deltaX = x - this.lastMouse.x;
            const deltaY = y - this.lastMouse.y;
            
            this.targetRotation.y += deltaX * 0.005;
            this.targetRotation.x -= deltaY * 0.005;
            
            this.lastMouse = { x, y };
        };

        window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
        window.addEventListener('touchmove', e => {
            if (this.isDragging) e.preventDefault();
            onMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        
        // Mouse / Touch End
        const onEnd = () => {
            this.isDragging = false;
            this.container.style.cursor = 'grab';
            // Retomar rotación automática suavemente después de un tiempo
            setTimeout(() => {
                if (!this.isDragging) this.autoRotate = true;
            }, 2000);
        };

        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotación automática
        if (this.autoRotate && !this.isDragging) {
            this.targetRotation.y += this.options.autoRotateSpeed * 0.01;
        }
        
        // Interpolación (Smooth damping)
        this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.1;
        this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.1;
        
        // Calcular matriz de rotación
        const cosX = Math.cos(this.rotation.x);
        const sinX = Math.sin(this.rotation.x);
        const cosY = Math.cos(this.rotation.y);
        const sinY = Math.sin(this.rotation.y);
        
        // Actualizar cada item
        const radius = this.options.radius;
        
        this.items.forEach(item => {
            const v = item.vector;
            
            // Rotar vector: primero en Y, luego en X
            // Rotación Y
            let x1 = v.x * cosY - v.z * sinY;
            let z1 = v.z * cosY + v.x * sinY;
            
            // Rotación X
            let y2 = v.y * cosX - z1 * sinX;
            let z2 = z1 * cosX + v.y * sinX;
            
            // Posición final
            const px = x1 * radius;
            const py = y2 * radius;
            const pz = z2 * radius;
            
            // Aplicar transformación
            // translate3d mueve el elemento
            // La escala simula profundidad adicional
            const scale = (pz + 2 * radius) / (3 * radius); // Factor de escala simple
            const opacity = (pz + radius) / (2 * radius) + 0.2;
            
            item.element.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) scale(${Math.max(0.5, scale)})`;
            item.element.style.opacity = Math.max(0.3, Math.min(1, opacity));
            item.element.style.zIndex = Math.floor(pz);
        });
    }
}

// Inicializar cuando se carguen las fotos
window.initDomeGallery = async function(providedPhotos) {
    const container = document.getElementById('dome-gallery-view');
    if (!container) return;
    
    // Limpiar instancia previa si existe para evitar duplicados o fugas de memoria
    if (window.currentDomeInstance) {
        // Podríamos añadir un método destroy() a la clase, pero por ahora innerHTML='' limpia el DOM
        window.currentDomeInstance = null;
    }
    
    try {
        let photos = providedPhotos;
        
        // Si no se pasaron fotos, intentamos obtenerlas de la BD
        if (!photos) {
            photos = await db.getPhotos();
        }
        
        // Si no hay fotos, mostrar mensaje
        if (!photos || photos.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: rgba(255,255,255,0.6); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%;">
                    <p style="font-size: 4rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite;">🪐</p>
                    <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">El universo está vacío...</h3>
                    <p>Sube fotos en la vista de cuadrícula para verlas flotando aquí.</p>
                </div>
            `;
            return;
        }

        // Determinar radio basado en pantalla
        const isMobile = window.innerWidth < 768;
        const radius = isMobile ? 140 : 280;

        // Guardar instancia global
        window.currentDomeInstance = new DomeGallery('dome-gallery-view', photos, {
            radius: radius,
            autoRotateSpeed: 0.4 // Un poco más rápido para que sea dinámico
        });
        
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
        // Animación de salida
        gsap.to(domeView, { opacity: 0, duration: 0.3, onComplete: () => {
            domeView.classList.add('hidden');
            gridView.classList.remove('hidden');
            gsap.fromTo(gridView, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
        }});
    } else {
        // Animación de entrada
        gsap.to(gridView, { opacity: 0, duration: 0.3, onComplete: () => {
            gridView.classList.add('hidden');
            domeView.classList.remove('hidden');
            domeView.style.opacity = 0;
            gsap.to(domeView, { opacity: 1, duration: 0.5 });
            
            // Inicializar (buscará fotos de nuevo para asegurar frescura)
            window.initDomeGallery();
        }});
    }
};

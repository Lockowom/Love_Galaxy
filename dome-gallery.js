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
        this.container.style.perspective = 'none'; // pseudo-3D controlado (escala+blur por profundidad)
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
        const size = this.options.itemSize || 110;

        // Construir los nodos: fotos reales + estrellas decorativas para que el
        // "universo" se vea lleno aunque haya pocas fotos.
        const nodes = this.images.map(d => ({ kind: 'photo', data: d }));
        const glyphs = ['✨', '🌟', '💫', '⭐', '💖', '🩷', '🌸'];
        const MIN_NODES = 16;
        for (let i = nodes.length; i < MIN_NODES; i++) {
            nodes.push({ kind: 'star', glyph: glyphs[i % glyphs.length] });
        }
        // Mezclar de forma determinista para repartir estrellas entre las fotos.
        for (let i = nodes.length - 1; i > 0; i--) {
            const j = (i * 7 + 3) % (i + 1);
            const t = nodes[i]; nodes[i] = nodes[j]; nodes[j] = t;
        }

        const n = nodes.length;
        nodes.forEach((node, i) => {
            const isPhoto = node.kind === 'photo';
            const sz = isPhoto ? size : Math.round(size * 0.5);

            const item = document.createElement('div');
            item.className = 'dome-item';
            item.style.cssText = 'position:absolute;width:' + sz + 'px;height:' + sz + 'px;left:' +
                (-sz / 2) + 'px;top:' + (-sz / 2) + 'px;transform-style:preserve-3d;backface-visibility:hidden;will-change:transform,opacity,filter;';

            if (isPhoto) {
                item.style.cursor = 'pointer';
                const img = document.createElement('img');
                img.src = node.data.url || node.data.src || node.data.dataUrl;
                img.alt = node.data.caption || 'Foto';
                img.loading = 'lazy';
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:16px;' +
                    'border:2px solid rgba(255,190,215,.9);box-shadow:0 8px 24px rgba(0,0,0,.5),0 0 14px rgba(217,138,163,.45);' +
                    'background:#1a1226;pointer-events:none;';
                item.onclick = (e) => {
                    e.stopPropagation();
                    if (window.viewPhotoFullscreen && node.data.id) window.viewPhotoFullscreen(node.data.id);
                };
                item.appendChild(img);
            } else {
                item.style.pointerEvents = 'none';
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.justifyContent = 'center';
                item.style.fontSize = Math.round(sz * 0.85) + 'px';
                item.textContent = node.glyph;
            }

            this.rotator.appendChild(item);

            // Distribución esférica SIN polos (i+0.5): se reparte bien con pocos puntos.
            const y = 1 - ((i + 0.5) / n) * 2;
            const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
            const theta = phi * i;
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;

            this.items.push({ element: item, vector: { x, y, z }, isPhoto });
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

            // Profundidad normalizada (0 = al fondo, 1 = al frente)
            const depth = (pz + radius) / (2 * radius);
            const scale = 0.55 + depth * 0.6;            // los de delante, más grandes
            const opacity = 0.25 + depth * 0.85;
            const bright = 0.6 + depth * 0.55;
            const blur = (1 - depth) * 2.2;              // los del fondo, desenfocados

            const el = item.element;
            el.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) scale(${scale})`;
            el.style.opacity = Math.min(1, opacity);
            el.style.filter = item.isPhoto
                ? `blur(${blur}px) brightness(${bright})`
                : `brightness(${bright}) drop-shadow(0 0 6px rgba(255,180,210,.85))`;
            el.style.zIndex = Math.floor(pz);
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

        // Determinar radio y tamaño según pantalla
        const isMobile = window.innerWidth < 768;
        const radius = isMobile ? 125 : 250;
        const itemSize = isMobile ? 92 : 120;

        // Guardar instancia global
        window.currentDomeInstance = new DomeGallery('dome-gallery-view', photos, {
            radius: radius,
            itemSize: itemSize,
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

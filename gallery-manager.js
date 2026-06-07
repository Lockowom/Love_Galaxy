// ================================================
// GALLERY-MANAGER — Galería de fotos
// Módulo ES. Expone window.GalleryManager = { init, loadGalleryPhotos } y las
// funciones usadas por onclick inline. Extraído de main.js.
// Depende de globales: db, showNotification, showToast, escapeHtml, gsap,
// window.achievements, window.initDomeGallery.
// ================================================

// init(): cablea filtros y formulario de subida (antes eran dos DOMContentLoaded).
function init() {
    // Filtros de galería
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

    // Formulario de subida de fotos
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

            try {
                // Feedback visual de progreso
                const btn = photoForm.querySelector('button[type="submit"]');
                btn.innerHTML = "Comprimiendo y subiendo... ☁️";
                btn.disabled = true;

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
                console.error("Error UI upload:", e);
                let errorMsg = "Error al subir la foto ❌";
                if (e.message && e.message.includes('storage')) errorMsg = "Error de almacenamiento (Verifica Supabase)";
                showNotification(errorMsg);
            } finally {
                const btn = photoForm.querySelector('button[type="submit"]');
                if (btn) {
                    btn.innerHTML = "💾 Guardar en la Galería";
                    btn.disabled = false;
                }
            }
        });
    }
    // La carga inicial de fotos se realiza en loadUserData() tras iniciar sesión.
}

// Modales de Fotos
function openPhotoUploadModal() {
    const modal = document.getElementById('photo-upload-modal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        void modal.offsetWidth; // forzar reflow (ayuda en móviles)
    }
}

function closePhotoUploadModal() {
    const modal = document.getElementById('photo-upload-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (!modal.classList.contains('active')) modal.style.display = 'none';
        }, 300);

        const form = document.getElementById('photo-upload-form');
        if (form) form.reset();
        const previewContainer = document.getElementById('photo-preview-container');
        if (previewContainer) previewContainer.style.display = 'none';
    }
}

function handlePhotoSelect(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Validación básica de tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification("❌ La foto es muy pesada (Máx 5MB)");
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('photo-preview');
            const container = document.getElementById('photo-preview-container');
            if (preview && container) {
                preview.src = e.target.result;
                container.style.display = 'block';
                gsap.fromTo(container, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 });
            }
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

        gridContainer.innerHTML = '';

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
                if (btn) btn.style.opacity = '1';
            });
            item.addEventListener('mouseleave', () => {
                const btn = item.querySelector('.btn-delete-photo');
                if (btn) btn.style.opacity = '0';
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

// Nombre legible de la categoría (versión unificada, con emojis)
function getCategoryName(category) {
    const names = {
        'juntos': 'Juntos 💑',
        'especiales': 'Especiales 💝',
        'viajes': 'Viajes ✈️',
        'celebraciones': 'Celebraciones 🎉'
    };
    return names[category] || category || 'Recuerdo';
}

// Borrar foto — UNIFICADA. `button` es opcional:
//  - sin button (p.ej. desde el grid: deletePhoto('id')): recarga la galería.
//  - con button (flujo legacy de placeholders): actualiza el DOM in situ.
async function deletePhoto(id, button) {
    if (!confirm("¿Quieres borrar esta foto de la galería?")) return;

    try {
        await db.deletePhoto(id);

        if (button && button.closest) {
            const galleryItem = button.closest('.gallery-item');
            const placeholder = galleryItem.querySelector('.gallery-placeholder');
            const category = galleryItem.getAttribute('data-category');

            placeholder.style.backgroundImage = '';
            placeholder.classList.remove('has-photo');
            galleryItem.classList.remove('has-photo');
            galleryItem.removeAttribute('data-photo-id');

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
            if (overlay) {
                overlay.innerHTML = `
                    <h4>Subir Foto</h4>
                    <button onclick="uploadPhoto(this)" class="btn-small">Subir Foto</button>
                `;
            }
            showToast('🗑️ Foto eliminada', 'info');
        } else {
            await loadGalleryPhotos();
            showNotification("Foto eliminada 🗑️");
        }
    } catch (e) {
        console.error(e);
        if (button) showToast('❌ Error al eliminar foto', 'error');
        else showNotification("Error al eliminar");
    }
}

// Funciones legacy (algunos onclick generados las usan)
function uploadPhoto(button) {
    openPhotoUploadModal();
}

function changePhoto(button) {
    uploadPhoto(button);
}

async function viewPhotoFullscreen(photoId) {
    const photos = await db.getPhotos();
    const photo = photos.find(p => p.id === photoId) || photos[photoId];

    if (!photo) return;

    const imageUrl = photo.url || photo.dataUrl;

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

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// --- Exposición global (onclick inline) + inicializador para main.js ---
window.openPhotoUploadModal = openPhotoUploadModal;
window.closePhotoUploadModal = closePhotoUploadModal;
window.handlePhotoSelect = handlePhotoSelect;
window.deletePhoto = deletePhoto;
window.uploadPhoto = uploadPhoto;
window.changePhoto = changePhoto;
window.viewPhotoFullscreen = viewPhotoFullscreen;
window.GalleryManager = { init, loadGalleryPhotos };

export { init, loadGalleryPhotos };

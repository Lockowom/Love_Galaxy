// ================================================
// TIMELINE-MANAGER — Historia / línea de tiempo editable
// Módulo ES. Expone window.TimelineManager = { init, loadTimelineEvents } y las
// funciones usadas por onclick inline. Extraído de main.js.
// Depende de globales: db, escapeHtml, showToast.
// ================================================

// Atajo "Agregar Detalles" del timeline estático (comportamiento original).
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
    }
}

function openTimelineEditor() {
    alert('¡Función de edición de timeline! 📝\n\nAquí podrás personalizar completamente la historia de tu amor. Próximamente con más funciones interactivas.');
}

async function loadTimelineEvents() {
    const timelineContainer = document.querySelector('.timeline');
    if (!timelineContainer) return;

    try {
        const savedEvents = await db.getTimelineEvents();

        if (savedEvents.length > 0) {
            const addButton = timelineContainer.querySelector('.timeline-add-btn');
            timelineContainer.innerHTML = '';

            savedEvents.forEach((event, index) => {
                const eventId = event.id || index;
                const timelineItem = createTimelineItem(event, eventId);
                timelineContainer.appendChild(timelineItem);
            });

            if (addButton) {
                timelineContainer.appendChild(addButton);
            } else {
                addTimelineButton(timelineContainer);
            }
        } else {
            if (!timelineContainer.querySelector('.timeline-add-btn')) {
                addTimelineButton(timelineContainer);
            }
        }
    } catch (e) {
        console.error('Error cargando timeline:', e);
    }
}

function createTimelineItem(event, id) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    const idParam = typeof id === 'string' ? `'${id}'` : id;
    item.setAttribute('data-event-id', id);

    let dateDisplay = event.date || event.date_str;

    item.innerHTML = `
        <div class="timeline-content">
            <div class="timeline-icon">${event.icon || '💕'}</div>
            <h3>${escapeHtml(event.title)}</h3>
            <p class="timeline-date">${escapeHtml(dateDisplay)}</p>
            <p>${escapeHtml(event.description)}</p>
            <div class="timeline-actions">
                <button onclick="editTimelineEvent(${idParam})" class="btn-small">✏️ Editar</button>
                <button onclick="deleteTimelineEvent(${idParam})" class="btn-small">🗑️ Eliminar</button>
            </div>
        </div>
    `;

    return item;
}

function addTimelineButton(container) {
    const addBtn = document.createElement('div');
    addBtn.className = 'timeline-item timeline-add-btn';
    addBtn.innerHTML = `
        <div class="timeline-content add-event-content">
            <div class="timeline-icon">➕</div>
            <h3>Agregar Evento</h3>
            <p>Añade un momento especial a tu historia</p>
            <button onclick="showAddEventModal()" class="btn-primary">Agregar Evento</button>
        </div>
    `;
    container.appendChild(addBtn);
}

function showAddEventModal() {
    const modal = document.createElement('div');
    modal.className = 'modal timeline-modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>✨ Agregar Evento a Nuestra Historia</h2>
            <form id="timeline-event-form">
                <div class="form-group">
                    <label>Título del Evento</label>
                    <input type="text" id="event-title" required placeholder="Ej: Nuestro Primer Beso">
                </div>
                <div class="form-group">
                    <label>Fecha</label>
                    <input type="text" id="event-date" required placeholder="Ej: Enero 2024">
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="event-description" required rows="4" placeholder="Describe este momento especial..."></textarea>
                </div>
                <div class="form-group">
                    <label>Icono (Emoji)</label>
                    <input type="text" id="event-icon" maxlength="2" placeholder="💕">
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="btn-primary">💾 Guardar Evento</button>
                    <button type="button" onclick="this.closest('.modal').remove()" class="btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector('#timeline-event-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const event = {
            title: document.getElementById('event-title').value,
            date_str: document.getElementById('event-date').value,
            date: document.getElementById('event-date').value,
            description: document.getElementById('event-description').value,
            icon: document.getElementById('event-icon').value || '💕'
        };

        try {
            await db.saveTimelineEvent(event);

            modal.remove();
            await loadTimelineEvents();
            showToast('✅ Evento agregado a tu historia', 'success');
        } catch (error) {
            console.error(error);
            showToast('❌ Error al guardar evento', 'error');
        }
    });
}

async function editTimelineEvent(id) {
    try {
        const events = await db.getTimelineEvents();
        let event = null;

        if (typeof id === 'string') {
            event = events.find(e => e.id === id);
        } else {
            event = events[id];
        }

        if (!event) return;

        const modal = document.createElement('div');
        modal.className = 'modal timeline-modal active';

        const dateValue = event.date_str || event.date;

        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="this.closest('.modal').remove()">&times;</span>
                <h2>✏️ Editar Evento</h2>
                <form id="edit-timeline-form">
                    <div class="form-group">
                        <label>Título del Evento</label>
                        <input type="text" id="edit-event-title" required value="${escapeHtml(event.title)}">
                    </div>
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="text" id="edit-event-date" required value="${escapeHtml(dateValue)}">
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="edit-event-description" required rows="4">${escapeHtml(event.description)}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Icono (Emoji)</label>
                        <input type="text" id="edit-event-icon" maxlength="2" value="${event.icon || '💕'}">
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="btn-primary">💾 Guardar Cambios</button>
                        <button type="button" onclick="this.closest('.modal').remove()" class="btn-secondary">Cancelar</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        const form = modal.querySelector('#edit-timeline-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const updatedEvent = {
                title: document.getElementById('edit-event-title').value,
                date_str: document.getElementById('edit-event-date').value,
                date: document.getElementById('edit-event-date').value,
                description: document.getElementById('edit-event-description').value,
                icon: document.getElementById('edit-event-icon').value || '💕'
            };

            try {
                await db.updateTimelineEvent(id, updatedEvent);

                modal.remove();
                await loadTimelineEvents();
                showToast('✅ Evento actualizado', 'success');
            } catch (error) {
                console.error(error);
                showToast('❌ Error al actualizar', 'error');
            }
        });
    } catch (e) {
        console.error('Error editando evento:', e);
    }
}

async function deleteTimelineEvent(id) {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
        await db.deleteTimelineEvent(id);
        await loadTimelineEvents();
        showToast('🗑️ Evento eliminado', 'info');
    } catch (error) {
        console.error(error);
        showToast('❌ Error al eliminar', 'error');
    }
}

// El timeline no cablea nada al inicio (sus formularios se crean al vuelo).
function init() { /* sin wiring estático */ }

// --- Exposición global (onclick inline) + inicializador para main.js ---
window.addMemory = addMemory;
window.openTimelineEditor = openTimelineEditor;
window.editTimelineEvent = editTimelineEvent;
window.deleteTimelineEvent = deleteTimelineEvent;
window.showAddEventModal = showAddEventModal;
window.TimelineManager = { init, loadTimelineEvents };

export { init, loadTimelineEvents };

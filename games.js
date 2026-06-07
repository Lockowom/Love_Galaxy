// ================================================
// UTILIDADES UI (MODALES Y EFECTOS)
// ================================================

function showGameMessage(title, message, icon = '✨') {
    // Crear modal dinámico si no existe
    let modal = document.getElementById('game-message-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'game-message-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="text-align: center; max-width: 400px;">
                <span class="modal-close" onclick="document.getElementById('game-message-modal').classList.remove('active')">&times;</span>
                <div id="msg-icon" style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 2s infinite;"></div>
                <h2 id="msg-title" style="color: var(--primary-color); margin-bottom: 1rem;"></h2>
                <p id="msg-text" style="font-size: 1.2rem; color: var(--text-secondary); line-height: 1.6;"></p>
                <button class="btn-primary" onclick="document.getElementById('game-message-modal').classList.remove('active')" style="margin-top: 2rem;">¡Genial! 💖</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('msg-icon').textContent = icon;
    document.getElementById('msg-title').textContent = title;
    document.getElementById('msg-text').innerHTML = message.replace(/\n/g, '<br>'); // Permitir saltos de línea
    
    modal.classList.add('active');
    
    // Efecto de confeti
    createConfetti();
}

function createConfetti() {
    const colors = ['#d98aa3', '#c9b3d9', '#f0bfa8', '#fbd5e0', '#ffffff'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            z-index: 10001;
            animation: fall ${2 + Math.random() * 3}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
    
    // Estilos para la animación si no existen
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.innerHTML = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ================================================
// JUEGO DE MEMORIA DEL AMOR MEJORADO
// ================================================

class MemoryGame {
    constructor() {
        this.cards = ['💕', '💖', '💗', '💓', '💞', '💝', '❤️', '💘'];
        this.deck = [...this.cards, ...this.cards];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isLocked = false; // Evitar clicks rápidos
    }

    init() {
        this.shuffle();
        this.render();
        this.startTimer();
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    render() {
        const board = document.getElementById('memory-board');
        if (!board) return;

        board.innerHTML = '';
        board.style.perspective = '1000px'; // Para efecto 3D
        
        this.deck.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.index = index;
            cardElement.dataset.value = card;
            
            // Estructura interna para flip 3D
            cardElement.innerHTML = `
                <div class="card-inner" style="position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.6s; transform-style: preserve-3d;">
                    <div class="card-front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: linear-gradient(135deg, #d98aa3, #c9b3d9); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 2rem; border: 1px solid #fff; box-shadow: 0 4px 10px rgba(74,59,67,0.12);">
                        ❓
                    </div>
                    <div class="card-back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: #fff; border-radius: 15px; transform: rotateY(180deg); display: flex; align-items: center; justify-content: center; font-size: 3rem; border: 1px solid #efe1e6;">
                        ${card}
                    </div>
                </div>
            `;
            
            cardElement.addEventListener('click', () => this.handleCardClick(cardElement));
            board.appendChild(cardElement);
        });
    }

    handleCardClick(cardElement) {
        if (this.isLocked) return;
        if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;

        // Voltear
        cardElement.classList.add('flipped');
        const inner = cardElement.querySelector('.card-inner');
        if (inner) inner.style.transform = 'rotateY(180deg)';
        
        this.flippedCards.push(cardElement);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            this.checkMatch();
        }
    }

    checkMatch() {
        this.isLocked = true;
        const [card1, card2] = this.flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                // Efecto visual de match
                card1.style.transform = 'scale(1.1)';
                card2.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    card1.style.transform = 'scale(1)';
                    card2.style.transform = 'scale(1)';
                }, 300);

                this.matchedPairs++;
                this.updatePairs();
                this.flippedCards = [];
                this.isLocked = false;

                if (this.matchedPairs === this.cards.length) {
                    this.gameWon();
                }
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                
                // Voltear de regreso
                const inner1 = card1.querySelector('.card-inner');
                const inner2 = card2.querySelector('.card-inner');
                if (inner1) inner1.style.transform = 'rotateY(0deg)';
                if (inner2) inner2.style.transform = 'rotateY(0deg)';
                
                this.flippedCards = [];
                this.isLocked = false;
            }, 1000);
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const seconds = Math.floor(elapsed / 1000);
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            
            const timeElement = document.getElementById('game-time');
            if (timeElement) {
                timeElement.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    updateMoves() {
        const movesElement = document.getElementById('moves-count');
        if (movesElement) {
            movesElement.textContent = this.moves;
        }
    }

    updatePairs() {
        const pairsElement = document.getElementById('pairs-found');
        if (pairsElement) {
            pairsElement.textContent = this.matchedPairs;
        }
    }

    gameWon() {
        clearInterval(this.timerInterval);
        setTimeout(() => {
            showGameMessage(
                '¡Juego Completado! 🎉',
                `Encontraste todas las parejas en ${this.moves} movimientos.\n\n¡Tu memoria es tan increíble como tu amor! 💕`,
                '🏆'
            );
        }, 500);
    }

    reset() {
        clearInterval(this.timerInterval);
        this.deck = [...this.cards, ...this.cards];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.isLocked = false;
        
        const movesElement = document.getElementById('moves-count');
        const pairsElement = document.getElementById('pairs-found');
        const timeElement = document.getElementById('game-time');
        
        if (movesElement) movesElement.textContent = '0';
        if (pairsElement) pairsElement.textContent = '0';
        if (timeElement) timeElement.textContent = '0:00';
        
        this.init();
    }
}

// ================================================
// RULETA DEL AMOR MEJORADA
// ================================================

class LoveRoulette {
    constructor() {
        this.options = [
            'Beso Apasionado 💋',
            'Abrazo de Oso 🐻',
            'Masaje de 5 min 💆‍♂️',
            'Cena Romántica 🍝',
            'Ver una Película 🎬',
            'Vale por un Deseo ✨',
            'Dedicar una Canción 🎵',
            'Hacer un Baile Tonto 💃'
        ];
        this.startAngle = 0;
        this.arc = Math.PI / (this.options.length / 2);
        this.spinTimeout = null;
        this.spinArcStart = 10;
        this.spinTime = 0;
        this.spinTimeTotal = 0;
        this.ctx = null;
        this.canvas = null;
    }

    init() {
        this.canvas = document.getElementById('roulette-canvas');
        if (!this.canvas) return;

        // Tamaño lógico fijo (la rueda mide ~400px); el CSS la escala de forma
        // responsive sin recortes ni distorsión. Nítida en pantallas retina.
        const dpr = window.devicePixelRatio || 1;
        const size = 420;
        this.canvas.width = size * dpr;
        this.canvas.height = size * dpr;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset por si se reinicializa
        this.ctx.scale(dpr, dpr);

        this.drawRouletteWheel();
        
        const spinBtn = document.getElementById('spin-btn');
        if (spinBtn) {
            spinBtn.addEventListener('click', () => this.spin());
        }
    }

    drawRouletteWheel() {
        if (!this.canvas || !this.ctx) return;
        
        const outsideRadius = 200;
        const textRadius = 160;
        const insideRadius = 50; // Agujero en el centro tipo dona
        
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        const centerX = width / 2;
        const centerY = height / 2;
        
        this.ctx.clearRect(0, 0, width, height);

        // Sombra externa
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
        this.ctx.shadowBlur = 20;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, outsideRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.restore();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.font = 'bold 14px Arial';

        for(let i = 0; i < this.options.length; i++) {
            const angle = this.startAngle + i * this.arc;
            
            // Colores alternados pastel
            this.ctx.fillStyle = i % 2 === 0 ? '#d98aa3' : '#c9b3d9';

            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, outsideRadius, angle, angle + this.arc, false);
            this.ctx.arc(centerX, centerY, insideRadius, angle + this.arc, angle, true);
            this.ctx.stroke();
            this.ctx.fill();

            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
            this.ctx.shadowBlur = 4;
            this.ctx.fillStyle = "white";
            this.ctx.translate(centerX + Math.cos(angle + this.arc / 2) * textRadius, 
                             centerY + Math.sin(angle + this.arc / 2) * textRadius);
            this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
            const text = this.options[i];
            this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, 0);
            this.ctx.restore();
        }

        // Flecha indicadora
        this.ctx.fillStyle = "#f0bfa8";
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 15, centerY - (outsideRadius + 20));
        this.ctx.lineTo(centerX + 15, centerY - (outsideRadius + 20));
        this.ctx.lineTo(centerX + 0, centerY - (outsideRadius - 10));
        this.ctx.fill();
        
        // Centro decorativo
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, insideRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, insideRadius - 10, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#c96f8e';
        this.ctx.fill();
        
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText('💖', centerX, centerY + 2);
    }

    spin() {
        this.spinArcStart = Math.random() * 10 + 10;
        this.spinTime = 0;
        this.spinTimeTotal = Math.random() * 3 + 4 * 1000;
        this.rotateWheel();
    }

    rotateWheel() {
        this.spinTime += 30;
        if(this.spinTime >= this.spinTimeTotal) {
            this.stopRotateWheel();
            return;
        }
        
        // Easing function para desaceleración suave
        const spinAngle = this.spinArcStart - this.easeOut(this.spinTime, 0, this.spinArcStart, this.spinTimeTotal);
        this.startAngle += (spinAngle * Math.PI / 180);
        this.drawRouletteWheel();
        this.spinTimeout = setTimeout(() => this.rotateWheel(), 30);
    }

    stopRotateWheel() {
        clearTimeout(this.spinTimeout);
        const degrees = this.startAngle * 180 / Math.PI + 90;
        const arcd = this.arc * 180 / Math.PI;
        const index = Math.floor((360 - degrees % 360) / arcd);
        this.ctx.save();
        this.ctx.font = 'bold 30px Arial';
        const text = this.options[index];
        
        // Mostrar resultado con el nuevo modal
        showGameMessage('¡La Ruleta Dice! 🎰', `Tu premio es:\n\n✨ ${text} ✨`, '🎁');
        
        this.ctx.restore();
    }

    easeOut(t, b, c, d) {
        const ts = (t/=d)*t;
        const tc = ts*t;
        return b+c*(tc + -3*ts + 3*t);
    }
}

// ================================================
// JUEGOS SIMPLES Y UTILIDADES
// ================================================

function calculateCompatibility() {
    const name1 = document.getElementById('name1').value.trim().toLowerCase();
    const name2 = document.getElementById('name2').value.trim().toLowerCase();
    
    if (name1 && name2) {
        // Mostrar animación de "Calculando..."
        showGameMessage('Calculando Amor...', 'Analizando ondas cerebrales...\nMidiendo latidos...\nConsultando a las estrellas... 🌟', '⏳');
        
        setTimeout(() => {
            // Algoritmo determinista avanzado basado en nombres y fecha actual
            let combined = name1 + name2;
            let sum = 0;
            for (let i = 0; i < combined.length; i++) {
                sum += combined.charCodeAt(i) * (i + 1);
            }
            
            // Factor del día para variar ligeramente (pero consistente durante el día)
            const today = new Date().toDateString();
            for (let i = 0; i < today.length; i++) {
                sum += today.charCodeAt(i);
            }
            
            // Resultado entre 85% y 100% (¡Siempre alto!)
            const percentage = 85 + (sum % 16);
            
            let message = "";
            if (percentage >= 98) message = "¡Almas Gemelas! El universo conspira a su favor. 🌌";
            else if (percentage >= 95) message = "¡Conexión Cósmica! Son tal para cual. 🚀";
            else if (percentage >= 90) message = "¡Amor Verdadero! Una historia para la eternidad. 📖";
            else message = "¡Pareja Perfecta! La química es innegable. 🧪";

            showGameMessage(
                'Resultado del Amor 💘',
                `La compatibilidad entre ${document.getElementById('name1').value} y ${document.getElementById('name2').value} es del:\n\n✨ ${percentage}% ✨\n\n${message}`,
                '💞'
            );
            
            // Desbloquear logro si es la primera vez
            if (window.achievements && window.achievements.unlock) {
                window.achievements.unlock('love_scientist');
            }
        }, 2000);
        
    } else {
        showGameMessage('Ups...', 'Por favor ingresa ambos nombres para calcular el amor.', '🤔');
    }
}

async function saveQuestionAnswer() {
    const answer = document.querySelector('#question-content .answer-input');
    const questionEl = document.querySelector('#question-content .question-text');
    if (answer && answer.value.trim() && questionEl) {
        const questionText = questionEl.textContent;
        
        if (window.db && window.db.saveQuestionAnswer) {
            await window.db.saveQuestionAnswer(questionText, answer.value);
        } else {
            const answers = JSON.parse(localStorage.getItem('questionAnswers') || '[]');
            answers.push({
                question: questionText,
                answer: answer.value,
                date: new Date().toISOString()
            });
            localStorage.setItem('questionAnswers', JSON.stringify(answers));
        }
        
        showGameMessage('¡Guardado! 💌', 'Tus pensamientos han sido guardados con amor.', '📝');
        closeQuestionModal();
    } else {
        showGameMessage('Espera...', 'Por favor escribe tu respuesta antes de guardar.', '✏️');
    }
}

function generateLoveLetter() {
    const parts = [
        ["Mi amor,", "Querida mía,", "Amor de mi vida,", "Mi cielo,", "Mi persona favorita,", "Dueña de mi corazón,"],
        ["cada vez que te veo,", "cuando pienso en ti,", "al despertar,", "en mis sueños,", "cuando escucho tu voz,", "con solo tu sonrisa,"],
        ["mi corazón late más fuerte.", "sonrío sin razón.", "el mundo se ilumina.", "me siento completo.", "todo cobra sentido.", "el tiempo se detiene."],
        ["Gracias por ser tú.", "Te amo infinitamente.", "Eres mi todo.", "Siempre tuyo.", "Eres mi lugar seguro.", "Contigo todo es mejor."],
        ["Con amor.", "Eternamente.", "Tu amor.", "Besos.", "Por siempre.", "Tuyo, hoy y siempre."]
    ];
    
    let letter = "";
    parts.forEach(part => {
        letter += part[Math.floor(Math.random() * part.length)] + "\n\n";
    });
    
    showGameMessage('Carta para Ti 💌', letter, '📜');
}

function generateDateIdea() {
    const ideas = [
        "Picnic bajo las estrellas ✨",
        "Noche de películas y manta 🎬",
        "Cocinar juntos una receta nueva 🍝",
        "Paseo por la playa al atardecer 🌅",
        "Visitar un museo o galería de arte 🎨",
        "Día de spa en casa 💆‍♀️",
        "Hacer una cápsula del tiempo 📦",
        "Ir a un parque de atracciones 🎡",
        "Noche de juegos de mesa 🎲",
        "Ver el amanecer juntos ☀️",
        "Cata de postres por la ciudad 🍰",
        "Sesión de fotos divertida 📸",
        "Ruta en bici al atardecer 🚲",
        "Noche de estrellas con telescopio 🔭",
        "Tarde de karaoke en casa 🎤",
        "Plantar algo juntos 🌱",
        "Escribirse cartas y leerlas 💌",
        "Maratón de la serie favorita 🍿",
        "Bailar lento en la sala 💃",
        "Escapada sorpresa de un día 🧳"
    ];
    
    const idea = ideas[Math.floor(Math.random() * ideas.length)];
    showGameMessage('Idea para Cita 💡', idea, '💑');
}

// ================================================
// CABLEADO DE JUEGOS (inicio / cierre / control)
// ================================================

let memoryGameInstance = null;
let loveRouletteInstance = null;

function openGameModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
}
function closeGameModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
}

// --- Juego de Memoria ---
function startMemoryGame() {
    openGameModal('memory-game-modal');
    if (!memoryGameInstance) memoryGameInstance = new MemoryGame();
    // reset() limpia el temporizador anterior y vuelve a inicializar (barajar/render)
    memoryGameInstance.reset();
}
function resetMemoryGame() {
    if (memoryGameInstance) memoryGameInstance.reset();
    else startMemoryGame();
}
function closeMemoryGame() {
    closeGameModal('memory-game-modal');
    if (memoryGameInstance && memoryGameInstance.timerInterval) {
        clearInterval(memoryGameInstance.timerInterval);
    }
}

// --- Pregunta del Día ---
function startQuestionGame() {
    const container = document.getElementById('question-content');
    if (container) {
        const bank = (typeof dailyQuestions !== 'undefined' && dailyQuestions.length)
            ? dailyQuestions
            : [{ question: '¿Qué es lo que más amas de nuestra relación?' }];
        const q = bank[new Date().getDate() % bank.length];

        container.innerHTML = `
            <p class="question-text">${escapeHtml(q.question)}</p>
            <textarea class="answer-input" rows="4" placeholder="Escribe tu respuesta con el corazón..."></textarea>
            <button class="btn-primary" style="margin-top: 1rem;" onclick="saveQuestionAnswer()">💌 Guardar respuesta</button>
            <div id="previous-answers" class="previous-answers"></div>
        `;
        loadPreviousAnswers();
    }
    openGameModal('question-modal');
}
function closeQuestionModal() {
    closeGameModal('question-modal');
}
async function loadPreviousAnswers() {
    const box = document.getElementById('previous-answers');
    if (!box) return;
    try {
        if (window.db && window.db.getQuestionAnswers) {
            const answers = await window.db.getQuestionAnswers();
            if (answers && answers.length) {
                box.innerHTML = '<h4 style="margin:1.5rem 0 0.5rem; color: var(--dark-pink, #c96f8e);">Respuestas anteriores 💭</h4>' +
                    answers.slice(0, 5).map(a => `
                        <div class="prev-answer" style="background: var(--surface-tint, #fdf3f5); border:1px solid var(--border-soft,#efe1e6); border-radius:12px; padding:0.85rem 1rem; margin-bottom:0.6rem; text-align:left;">
                            <strong style="color: var(--dark-pink,#c96f8e); display:block; font-size:0.85rem; margin-bottom:0.25rem;">${escapeHtml(a.question)}</strong>
                            <span style="color: var(--text-secondary,#8a7b82);">${escapeHtml(a.answer)}</span>
                        </div>`).join('');
            }
        }
    } catch (e) { /* sin historial disponible */ }
}

// --- Ruleta del Amor ---
function startRouletteGame() {
    openGameModal('roulette-modal');
    if (!loveRouletteInstance) loveRouletteInstance = new LoveRoulette();
    // Esperar a que el modal sea visible para medir el canvas correctamente
    setTimeout(() => loveRouletteInstance.init(), 120);
}
function spinRoulette() {
    if (loveRouletteInstance) loveRouletteInstance.spin();
}
function closeRouletteModal() {
    closeGameModal('roulette-modal');
    if (loveRouletteInstance && loveRouletteInstance.spinTimeout) {
        clearTimeout(loveRouletteInstance.spinTimeout);
    }
}

// --- Test de Compatibilidad ---
const compatibilityQuestions = [
    {
        q: '¿Cómo es su plan ideal de fin de semana?',
        options: [
            { text: 'Aventura y viajes 🌍', pts: 3 },
            { text: 'Maratón de pelis en casa 🍿', pts: 2 },
            { text: 'Salir con amigos 🥂', pts: 1 }
        ]
    },
    {
        q: '¿Cuál es su lenguaje del amor?',
        options: [
            { text: 'Tiempo de calidad ⏳', pts: 3 },
            { text: 'Palabras de afirmación 💬', pts: 2 },
            { text: 'Detalles y regalos 🎁', pts: 2 }
        ]
    },
    {
        q: 'Ante una discusión, ¿qué hacen?',
        options: [
            { text: 'Hablamos y lo resolvemos 🤝', pts: 3 },
            { text: 'Nos damos espacio y volvemos 🌿', pts: 2 },
            { text: 'Un abrazo lo cura todo 🤗', pts: 3 }
        ]
    },
    {
        q: '¿Comparten gustos musicales?',
        options: [
            { text: '¡Casi siempre! 🎵', pts: 3 },
            { text: 'A veces 🎧', pts: 2 },
            { text: 'Opuestos que se atraen 🎸', pts: 2 }
        ]
    },
    {
        q: '¿Cómo ven el futuro juntos?',
        options: [
            { text: 'Construyendo todo en pareja 🏡', pts: 3 },
            { text: 'Disfrutando el presente 🌅', pts: 2 },
            { text: 'Creciendo cada quien y juntos 🌱', pts: 3 }
        ]
    }
];

function startCompatibilityTest() {
    const c = document.getElementById('compatibility-test');
    if (c) {
        c.innerHTML = compatibilityQuestions.map((item, qi) => `
            <div class="compatibility-question">
                <h4>${qi + 1}. ${escapeHtml(item.q)}</h4>
                <div class="compatibility-options">
                    ${item.options.map(op => `
                        <div class="compatibility-option" data-q="${qi}" data-pts="${op.pts}" onclick="selectCompatOption(this)">${escapeHtml(op.text)}</div>
                    `).join('')}
                </div>
            </div>
        `).join('') + `
            <button class="btn-primary" style="display:block; margin: 1rem auto 0;" onclick="computeCompatibility()">💞 Ver resultado</button>
            <div id="compat-result"></div>
        `;
    }
    openGameModal('compatibility-modal');
}
function selectCompatOption(el) {
    const q = el.dataset.q;
    document.querySelectorAll('.compatibility-option[data-q="' + q + '"]').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
}
function computeCompatibility() {
    const total = compatibilityQuestions.length;
    let answered = 0, pts = 0;
    for (let i = 0; i < total; i++) {
        const sel = document.querySelector('.compatibility-option.selected[data-q="' + i + '"]');
        if (sel) { answered++; pts += parseInt(sel.dataset.pts, 10) || 0; }
    }
    if (answered < total) {
        showGameMessage('Casi...', 'Responde todas las preguntas para descubrir su compatibilidad 💕', '📝');
        return;
    }
    const maxPts = total * 3;
    const pct = Math.round(85 + (pts / maxPts) * 15); // siempre entre 85% y 100%

    let msg;
    if (pct >= 98) msg = '¡Almas gemelas! El universo los hizo el uno para el otro. 🌌';
    else if (pct >= 94) msg = '¡Conexión cósmica! Su química es innegable. 🚀';
    else if (pct >= 90) msg = '¡Amor verdadero! Una historia para la eternidad. 📖';
    else msg = '¡Pareja perfecta! Juntos son imparables. 💪';

    const box = document.getElementById('compat-result');
    if (box) {
        box.innerHTML = `
            <div class="compatibility-result">
                <div class="compatibility-percentage">${pct}%</div>
                <p>${msg}</p>
            </div>`;
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    createConfetti();
    if (window.achievements && window.achievements.unlock) {
        window.achievements.unlock('love_scientist');
    }
}
function closeCompatibilityModal() {
    closeGameModal('compatibility-modal');
}

// Exportar a window (los onclick del HTML son globales)
Object.assign(window, {
    startMemoryGame, resetMemoryGame, closeMemoryGame,
    startQuestionGame, closeQuestionModal,
    startRouletteGame, spinRoulette, closeRouletteModal,
    startCompatibilityTest, selectCompatOption, computeCompatibility, closeCompatibilityModal,
    generateDateIdea, generateLoveLetter, calculateCompatibility, saveQuestionAnswer
});
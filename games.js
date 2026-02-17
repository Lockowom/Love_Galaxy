// ================================================
// JUEGO DE MEMORIA DEL AMOR
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
        
        this.deck.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.index = index;
            cardElement.dataset.value = card;
            cardElement.innerHTML = '<span class="card-back">💝</span>';
            
            cardElement.addEventListener('click', () => this.handleCardClick(cardElement));
            board.appendChild(cardElement);
        });
    }

    handleCardClick(cardElement) {
        if (this.flippedCards.length >= 2) return;
        if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;

        cardElement.classList.add('flipped');
        cardElement.innerHTML = cardElement.dataset.value;
        this.flippedCards.push(cardElement);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                this.matchedPairs++;
                this.updatePairs();
                this.flippedCards = [];

                if (this.matchedPairs === this.cards.length) {
                    this.gameWon();
                }
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.innerHTML = '<span class="card-back">💝</span>';
                card2.innerHTML = '<span class="card-back">💝</span>';
                this.flippedCards = [];
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
            alert(`¡Felicidades! 🎉\n\nCompletaste el juego en ${this.moves} movimientos.\n\n¡Tu memoria es tan increíble como tu amor! 💕`);
        }, 500);
    }

    reset() {
        clearInterval(this.timerInterval);
        this.deck = [...this.cards, ...this.cards];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        
        const movesElement = document.getElementById('moves-count');
        const pairsElement = document.getElementById('pairs-found');
        const timeElement = document.getElementById('game-time');
        
        if (movesElement) movesElement.textContent = '0';
        if (pairsElement) pairsElement.textContent = '0';
        if (timeElement) timeElement.textContent = '0:00';
        
        this.init();
    }
}

let currentMemoryGame = null;

function startMemoryGame() {
    const modal = document.getElementById('memory-game-modal');
    if (modal) {
        modal.classList.add('active');
        currentMemoryGame = new MemoryGame();
        currentMemoryGame.init();
    }
}

function closeMemoryGame() {
    const modal = document.getElementById('memory-game-modal');
    if (modal) {
        modal.classList.remove('active');
        if (currentMemoryGame) {
            clearInterval(currentMemoryGame.timerInterval);
        }
    }
}

function resetMemoryGame() {
    if (currentMemoryGame) {
        currentMemoryGame.reset();
    }
}

// ================================================
// PREGUNTA DEL DÍA
// ================================================

const questions = [
    "¿Cuál fue el momento en que supiste que estabas enamorado/a?",
    "¿Qué es lo que más admiras de tu pareja?",
    "¿Cuál es tu recuerdo favorito juntos?",
    "Si pudieras describir tu amor en una palabra, ¿cuál sería?",
    "¿Qué canción describe mejor su relación?",
    "¿Cuál es tu forma favorita de demostrar amor?",
    "¿Qué te hace sonreír cuando piensas en tu pareja?",
    "¿Cuál es el mejor consejo que has recibido sobre el amor?",
    "¿Qué es lo que hace diferente a esta relación?",
    "¿Cuál es tu sueño más grande para el futuro juntos?",
    "¿Qué cualidad de tu pareja te hace sentir más amado/a?",
    "¿Cuál ha sido el mejor regalo que te ha dado tu pareja?",
    "¿Qué actividad disfrutan más hacer juntos?",
    "¿Cuál es tu apodo favorito que te dice tu pareja?",
    "¿Qué momento te hizo darte cuenta de que era 'la persona'?",
    "¿Qué te hace sentir más conectado/a con tu pareja?",
    "¿Cuál es tu tradición favorita como pareja?",
    "¿Qué es lo primero que piensas cuando despiertas?",
    "¿Qué es lo que más te gusta de los abrazos de tu pareja?",
    "¿Cuál es tu sueño más romántico juntos?"
];

function startQuestionGame() {
    const modal = document.getElementById('question-modal');
    const content = document.getElementById('question-content');
    
    if (modal && content) {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        content.innerHTML = `
            <div class="question-text">${randomQuestion}</div>
            <textarea class="answer-input" placeholder="Escribe tu respuesta aquí..." rows="6"></textarea>
            <button class="btn-primary" onclick="saveQuestionAnswer()">Guardar Respuesta 💕</button>
            <button class="btn-small" onclick="startQuestionGame()">Otra Pregunta</button>
        `;
        
        modal.classList.add('active');
    }
}

function closeQuestionModal() {
    const modal = document.getElementById('question-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveQuestionAnswer() {
    const answer = document.querySelector('.answer-input');
    if (answer && answer.value.trim()) {
        const answers = JSON.parse(localStorage.getItem('questionAnswers') || '[]');
        answers.push({
            question: document.querySelector('.question-text').textContent,
            answer: answer.value,
            date: new Date().toISOString()
        });
        localStorage.setItem('questionAnswers', JSON.stringify(answers));
        
        alert('¡Respuesta guardada! 💕\n\nTus pensamientos han sido guardados con amor.');
        closeQuestionModal();
    } else {
        alert('Por favor, escribe tu respuesta antes de guardar. 😊');
    }
}

// ================================================
// RULETA DEL AMOR
// ================================================

class LoveRoulette {
    constructor() {
        this.activities = [
            "🌹 Envía flores sorpresa",
            "💌 Escribe una carta de amor",
            "🍝 Cocina su comida favorita",
            "💆 Da un masaje relajante",
            "🎵 Crea una playlist especial",
            "📸 Sesión de fotos romántica",
            "🌅 Plan para ver el amanecer",
            "🎁 Sorpresa personalizada",
            "💕 Día de mimos y cariño",
            "🎬 Maratón de películas favoritas",
            "☕ Desayuno en la cama",
            "🌟 Noche de observar estrellas"
        ];
        
        this.canvas = null;
        this.ctx = null;
        this.spinning = false;
        this.rotation = 0;
        this.targetRotation = 0;
    }

    init() {
        this.canvas = document.getElementById('roulette-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.draw();
    }

    draw() {
        if (!this.ctx) return;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 180;
        const sliceAngle = (Math.PI * 2) / this.activities.length;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar segmentos
        this.activities.forEach((activity, index) => {
            const startAngle = index * sliceAngle + this.rotation;
            const endAngle = startAngle + sliceAngle;
            
            // Color alternado
            const colors = ['#ff1493', '#ff69b4', '#ff6b9d', '#c71585'];
            this.ctx.fillStyle = colors[index % colors.length];
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Borde
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Texto
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(startAngle + sliceAngle / 2);
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.fillText(activity.substring(2), radius * 0.7, 0);
            this.ctx.restore();
        });
        
        // Centro
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ff1493';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('GIRA', centerX, centerY);
        
        // Indicador
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 10);
        this.ctx.lineTo(centerX - 15, 40);
        this.ctx.lineTo(centerX + 15, 40);
        this.ctx.closePath();
        this.ctx.fill();
    }

    spin() {
        if (this.spinning) return;
        
        this.spinning = true;
        const spins = 5 + Math.random() * 5;
        const extraRotation = Math.random() * Math.PI * 2;
        this.targetRotation = this.rotation + spins * Math.PI * 2 + extraRotation;
        
        this.animate();
    }

    animate() {
        const diff = this.targetRotation - this.rotation;
        const speed = diff * 0.05;
        
        this.rotation += speed;
        this.draw();
        
        if (Math.abs(diff) > 0.01) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.rotation = this.targetRotation;
            this.spinning = false;
            this.showResult();
        }
    }

    showResult() {
        const sliceAngle = (Math.PI * 2) / this.activities.length;
        const normalizedRotation = (this.rotation % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const selectedIndex = Math.floor((Math.PI * 2 - normalizedRotation + Math.PI / 2) / sliceAngle) % this.activities.length;
        
        const result = this.activities[selectedIndex];
        const resultDiv = document.getElementById('roulette-result');
        
        if (resultDiv) {
            resultDiv.innerHTML = `
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">¡Tu actividad romántica es!</h3>
                <p style="font-size: 1.5rem;">${result}</p>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-secondary);">¡Haz que este momento sea especial! 💕</p>
            `;
        }
    }
}

let currentRoulette = null;

function startRouletteGame() {
    const modal = document.getElementById('roulette-modal');
    if (modal) {
        modal.classList.add('active');
        if (!currentRoulette) {
            currentRoulette = new LoveRoulette();
        }
        setTimeout(() => {
            currentRoulette.init();
        }, 100);
    }
}

function closeRouletteModal() {
    const modal = document.getElementById('roulette-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function spinRoulette() {
    if (currentRoulette) {
        currentRoulette.spin();
    }
}

// ================================================
// TEST DE COMPATIBILIDAD
// ================================================

const compatibilityQuestions = [
    {
        question: "¿Qué prefieres para una cita perfecta?",
        options: [
            { text: "Cena romántica a la luz de las velas", points: 25 },
            { text: "Aventura al aire libre", points: 20 },
            { text: "Noche de películas en casa", points: 15 },
            { text: "Concierto o evento en vivo", points: 20 }
        ]
    },
    {
        question: "¿Cómo expresas tu amor?",
        options: [
            { text: "Palabras de afirmación", points: 25 },
            { text: "Actos de servicio", points: 20 },
            { text: "Regalos significativos", points: 15 },
            { text: "Tiempo de calidad juntos", points: 25 }
        ]
    },
    {
        question: "¿Qué valoras más en una relación?",
        options: [
            { text: "Comunicación abierta", points: 25 },
            { text: "Apoyo mutuo", points: 25 },
            { text: "Espacio personal", points: 15 },
            { text: "Diversión y risas", points: 20 }
        ]
    },
    {
        question: "¿Cuál es tu idea de un fin de semana perfecto juntos?",
        options: [
            { text: "Escapada romántica", points: 25 },
            { text: "Relajarse en casa", points: 20 },
            { text: "Explorar nuevos lugares", points: 20 },
            { text: "Tiempo con amigos y familia", points: 15 }
        ]
    }
];

function startCompatibilityTest() {
    const modal = document.getElementById('compatibility-modal');
    const testDiv = document.getElementById('compatibility-test');
    
    if (modal && testDiv) {
        let currentQuestion = 0;
        let score = 0;
        
        function showQuestion() {
            if (currentQuestion < compatibilityQuestions.length) {
                const q = compatibilityQuestions[currentQuestion];
                testDiv.innerHTML = `
                    <div class="compatibility-question">
                        <h4>Pregunta ${currentQuestion + 1} de ${compatibilityQuestions.length}</h4>
                        <p style="font-size: 1.2rem; color: var(--primary-color); margin: 1rem 0 2rem;">${q.question}</p>
                        <div class="compatibility-options">
                            ${q.options.map((option, index) => `
                                <div class="compatibility-option" onclick="selectCompatibilityOption(${index}, ${option.points})">
                                    ${option.text}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else {
                showCompatibilityResult();
            }
        }
        
        window.selectCompatibilityOption = function(index, points) {
            score += points;
            currentQuestion++;
            showQuestion();
        };
        
        function showCompatibilityResult() {
            const percentage = Math.min(100, score);
            let message = '';
            
            if (percentage >= 90) {
                message = '¡Son la pareja perfecta! Su conexión es extraordinaria. 💕✨';
            } else if (percentage >= 75) {
                message = '¡Excelente compatibilidad! Tienen una relación muy especial. 💖';
            } else if (percentage >= 60) {
                message = '¡Buena compatibilidad! Siguen construyendo algo hermoso. 💗';
            } else {
                message = '¡Tienen potencial! Cada día se conocen más. 💓';
            }
            
            testDiv.innerHTML = `
                <div class="compatibility-result">
                    <h3>Resultado del Test</h3>
                    <div class="compatibility-percentage">${percentage}%</div>
                    <p style="font-size: 1.2rem; margin: 2rem 0;">${message}</p>
                    <button class="btn-primary" onclick="startCompatibilityTest()">Hacer Test Otra Vez</button>
                </div>
            `;
        }
        
        showQuestion();
        modal.classList.add('active');
    }
}

function closeCompatibilityModal() {
    const modal = document.getElementById('compatibility-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ================================================
// GENERADOR DE IDEAS PARA CITAS
// ================================================

const dateIdeasExtended = [
    "🌅 Ver el amanecer juntos en un lugar especial",
    "🎨 Tomar una clase de arte o cerámica juntos",
    "🍕 Cocinar una pizza casera desde cero",
    "🌳 Hacer un picnic en el parque favorito",
    "⭐ Noche de observación de estrellas con mantas",
    "🎬 Crear su propia película o video juntos",
    "🚴 Paseo en bicicleta al atardecer",
    "☕ Tour por cafeterías locales",
    "🎵 Ir a un concierto o karaoke",
    "📚 Visitar una librería y elegir libros mutuamente",
    "🏖️ Día de spa casero con velas y música relajante",
    "🎪 Visitar un mercado de pulgas o feria local",
    "🌺 Explorar un jardín botánico",
    "🎭 Noche de teatro o comedia en vivo",
    "🍷 Cata de vinos o degustación de chocolates",
    "🏛️ Visitar museos y galerías de arte",
    "🍦 Buscar la mejor heladería de la ciudad",
    "🌃 Paseo nocturno fotografiando la ciudad",
    "🎮 Noche de videojuegos retro o arcade",
    "🧘 Clase de yoga o meditación en pareja"
];

function generateDateIdea() {
    const idea = dateIdeasExtended[Math.floor(Math.random() * dateIdeasExtended.length)];
    alert(`💡 Idea para tu próxima cita:\n\n${idea}\n\n¡Que disfruten este momento especial juntos! 💕`);
}

// ================================================
// GENERADOR DE CARTAS DE AMOR
// ================================================

const loveLetterOpenings = [
    "Mi querida Tamara,",
    "Para mi amor eterno, Tamara,",
    "Mi hermosa Tamara,",
    "A la luz de mi vida, Tamara,",
    "Mi amada Tamara,"
];

const loveLetterMiddle = [
    "Cada día que pasa me doy cuenta de lo afortunado/a que soy de tenerte en mi vida.",
    "Tu sonrisa ilumina incluso mis días más oscuros y me recuerda por qué vale la pena todo.",
    "No hay palabras suficientes para expresar lo que siento cuando estoy contigo.",
    "Eres la respuesta a preguntas que ni siquiera sabía que tenía.",
    "Contigo he aprendido el verdadero significado del amor y la felicidad."
];

const loveLetterDetails = [
    "Me encanta la forma en que me miras, como si fuera la única persona en el mundo.",
    "Admiro tu fuerza, tu bondad y la manera en que haces que todo sea mejor.",
    "Cada momento contigo es un tesoro que guardo en mi corazón.",
    "Tu risa es la melodía más hermosa que jamás he escuchado.",
    "Me haces querer ser una mejor persona cada día."
];

const loveLetterClosings = [
    "Por siempre tuyo/a, con todo mi amor 💕",
    "Eternamente enamorado/a de ti 💖",
    "Tuyo/a por siempre, en este y todos los universos 💗",
    "Con amor infinito 💓",
    "Para siempre en mi corazón 💞"
];

function generateLoveLetter() {
    const opening = loveLetterOpenings[Math.floor(Math.random() * loveLetterOpenings.length)];
    const middle = loveLetterMiddle[Math.floor(Math.random() * loveLetterMiddle.length)];
    const detail = loveLetterDetails[Math.floor(Math.random() * loveLetterDetails.length)];
    const closing = loveLetterClosings[Math.floor(Math.random() * loveLetterClosings.length)];
    
    const letter = `${opening}\n\n${middle}\n\n${detail}\n\n${closing}`;
    
    alert(`💌 Tu carta de amor:\n\n${letter}\n\n¡Copia y envía este mensaje especial!`);
}

// ================================================
// INICIALIZACIÓN DE EVENTOS
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Sistema de juegos cargado correctamente');
});

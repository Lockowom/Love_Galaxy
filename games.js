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
    const colors = ['#ff1493', '#ff69b4', '#ffd700', '#00ffff', '#ffffff'];
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
                    <div class="card-front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: linear-gradient(135deg, #ff1493, #ff69b4); border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 2rem; border: 2px solid #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                        ❓
                    </div>
                    <div class="card-back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: #fff; border-radius: 15px; transform: rotateY(180deg); display: flex; align-items: center; justify-content: center; font-size: 3rem; border: 2px solid #ff1493;">
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
        
        // Ajustar resolución para pantallas retina
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(dpr, dpr);
        
        // Ajustar tamaño lógico
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        
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
            
            // Colores alternados vibrantes
            this.ctx.fillStyle = i % 2 === 0 ? '#ff1493' : '#ff69b4';

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
        this.ctx.fillStyle = "#ffd700";
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
        this.ctx.fillStyle = '#ff1493';
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
        // Algoritmo determinista simple basado en los nombres
        let combined = name1 + name2;
        let sum = 0;
        for (let i = 0; i < combined.length; i++) {
            sum += combined.charCodeAt(i);
        }
        
        // Compatibilidad entre 70% y 100% (¡porque siempre es alta!)
        const percentage = 70 + (sum % 31);
        
        showGameMessage(
            'Resultado del Amor 💘',
            `La compatibilidad entre ${name1} y ${name2} es del:\n\n${percentage}%\n\n¡Son la pareja perfecta! 💑`,
            '💞'
        );
    } else {
        showGameMessage('Ups...', 'Por favor ingresa ambos nombres para calcular el amor.', '🤔');
    }
}

async function saveQuestionAnswer() {
    const answer = document.querySelector('.answer-input');
    if (answer && answer.value.trim()) {
        const questionText = document.querySelector('.question-text').textContent;
        
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
        ["Mi amor,", "Querida mía,", "Amor de mi vida,", "Mi cielo,"],
        ["cada vez que te veo,", "cuando pienso en ti,", "al despertar,", "en mis sueños,"],
        ["mi corazón late más fuerte.", "sonrío sin razón.", "el mundo se ilumina.", "me siento completo."],
        ["Gracias por ser tú.", "Te amo infinitamente.", "Eres mi todo.", "Siempre tuyo."],
        ["Con amor.", "Eternamente.", "Tu amor.", "Besos."]
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
        "Ver el amanecer juntos ☀️"
    ];
    
    const idea = ideas[Math.floor(Math.random() * ideas.length)];
    showGameMessage('Idea para Cita 💡', idea, '💑');
}
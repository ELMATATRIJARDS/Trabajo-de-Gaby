const questions = [
    { question: "¿Cuál es la capital de Francia?", answers: ["París", "Londres", "Roma", "Madrid"], correct: 0 },
    { question: "¿Cuánto es 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1 },
    // Agrega más preguntas aquí
];

const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFC300", "#DAF7A6", "#581845"];
const segments = ["Pregunta 1", "Pregunta 2", "Pregunta 3", "Pregunta 4", "Pregunta 5", "Pregunta 6"];
let currentQuestion = 0;
let spinning = false;
let stars = 0; // Contador de estrellas
let correctAnswers = 0; // Contador de respuestas correctas

const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinButton = document.getElementById("spinButton");
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");
const starsCounter = document.getElementById("starsCounter"); // Elemento para mostrar las estrellas
const correctAnswersCounter = document.getElementById("correctAnswersCounter"); // Elemento para mostrar respuestas correctas
const endGameMessage = document.getElementById("endGameMessage"); // Elemento para mostrar mensaje de finalización
const restartButtonContainer = document.getElementById("playAgainButton"); // Botón para reiniciar el juego

function drawWheel() {
    const arc = (2 * Math.PI) / segments.length;
    segments.forEach((segment, index) => {
        const startAngle = index * arc;
        const endAngle = startAngle + arc;
        ctx.beginPath();
        ctx.arc(200, 200, 200, startAngle, endAngle);
        ctx.lineTo(200, 200);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(startAngle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.fillText(segment, 180, 10);
        ctx.restore();
    });
}

function spinWheel() {
    // Verifica si ya no hay más preguntas antes de girar la ruleta
    if (spinning || currentQuestion >= questions.length) return;

    spinning = true;
    let rotation = Math.random() * 360 + 720; // Gira al menos 2 vueltas
    const duration = 3000; // 3 segundos
    const start = performance.now();

    function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const angle = progress * rotation;

        ctx.clearRect(0, 0, wheel.width, wheel.height);
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.translate(-200, -200);
        drawWheel();
        ctx.restore();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            showQuestion(); // Mostrar la siguiente pregunta o el mensaje de fin de juego
        }
    }

    requestAnimationFrame(animate);
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        showEndGameMessage(); // Muestra el mensaje de fin de juego si ya no hay más preguntas
        return;
    }

    questionContainer.classList.remove("hidden");
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    answersContainer.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const button = document.createElement("div");
        button.classList.add("answer");
        button.textContent = answer;
        button.onclick = () => checkAnswer(button, index);
        answersContainer.appendChild(button);
    });
}

function checkAnswer(button, selected) {
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll(".answer");

    // Deshabilitar todas las respuestas después de seleccionar una
    buttons.forEach(btn => btn.style.pointerEvents = "none");

    if (selected === question.correct) {
        button.classList.add("correct");
        stars++; // Incrementar estrellas si la respuesta es correcta
        correctAnswers++; // Incrementar el contador de respuestas correctas
        showFeedback("¡Correcto! Has ganado una estrella", "#4CAF50");
    } else {
        button.classList.add("incorrect");
        stars = 0; // Restablecer estrellas a 0 si la respuesta es incorrecta
        showFeedback("Incorrecto", "#FF5733");
    }

    // Actualizar los contadores de estrellas y respuestas correctas
    starsCounter.textContent = `Estrellas: ${stars}`;
    correctAnswersCounter.textContent = `Respuestas Correctas: ${correctAnswers}`;

    // Girar la ruleta inmediatamente después de contestar la pregunta
    setTimeout(() => {
        currentQuestion++; // Incrementar al siguiente índice de pregunta
        spinWheel();  // Comienza el giro de la ruleta inmediatamente después de la respuesta
    }, 1000); // Esto da un pequeño delay antes de comenzar el giro
}

function showFeedback(text, color) {
    const feedback = document.createElement("div");
    feedback.textContent = text;
    feedback.style.fontSize = "24px";
    feedback.style.fontWeight = "bold";
    feedback.style.color = color;
    feedback.style.marginTop = "20px";
    feedback.style.padding = "10px";
    feedback.style.backgroundColor = "#f1f1f1";
    feedback.style.borderRadius = "8px";
    questionContainer.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 2000); // El mensaje desaparece después de 2 segundos
}

function showEndGameMessage() {
    // Mostrar el mensaje de finalización del juego
    endGameMessage.textContent = "¡Juego Finalizado!";
    endGameMessage.style.fontSize = "50px";
    endGameMessage.style.fontWeight = "bold";
    endGameMessage.style.color = "#FF5733"; // Color opcional
    endGameMessage.style.marginTop = "20px";
    endGameMessage.style.textAlign = "center";
    endGameMessage.classList.remove("hidden");

    // Deshabilitar el botón de spin
    spinButton.disabled = true;

    // Mostrar el botón de "Jugar de nuevo"
    restartButtonContainer.classList.remove("hidden");
}

function restartGame() {
    // Reiniciar el juego
    currentQuestion = 0;
    stars = 0;
    correctAnswers = 0;
    starsCounter.textContent = `Estrellas: ${stars}`;
    correctAnswersCounter.textContent = `Respuestas Correctas: ${correctAnswers}`;
    endGameMessage.classList.add("hidden");
    restartButtonContainer.classList.add("hidden");
    spinButton.disabled = false;
    drawWheel();
    showQuestion(); // Muestra la primera pregunta
}

// Inicializar el juego
spinButton.addEventListener("click", spinWheel);
restartButtonContainer.addEventListener("click", restartGame);

drawWheel(); // Dibujar la rueda al cargar la página

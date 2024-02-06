let startTime;
let isRunning = false;
let accumulatedTime = 0;
let currentLabel = "To-do"; // Inicializa com a label padrão

// Carrega o tempo acumulado e o estado do cronômetro ao iniciar a página
window.addEventListener("load", () => {
    const savedTime = sessionStorage.getItem("time");
    const isRunningSaved = sessionStorage.getItem("isRunning");

    if (savedTime) {
        accumulatedTime = parseInt(savedTime, 10);
        document.getElementById("timer").innerText = formatTime(Math.floor(accumulatedTime / 1000));

        // Se o cronômetro estava em execução, reinicia
        if (isRunningSaved === "true") {
            startTimer();
        }
    }
});

function startTimer() {
    if (!isRunning) {
        // Adiciona a label "Development"
        addLabel("Development");
        startTime = Date.now();
        isRunning = true;
        accumulatedTime = 0;
        sessionStorage.setItem("isRunning", "true");
        requestAnimationFrame(updateTimer);
    }
}

function stopTimer() {
    if (isRunning) {
        // Remove a label "Development"
        removeLabel("Development");
        const elapsedTime = Date.now() - startTime + accumulatedTime;
        accumulatedTime += elapsedTime;

        const reason = prompt("Motivo para parar:");

        const comment = generateComment(elapsedTime, reason);

        // Adiciona a label "To-do"
        addLabel("To-do");

        // Adiciona o comentário
        addComment(comment);

        // Reinicializa o cronômetro
        isRunning = false;
        sessionStorage.setItem("isRunning", "false");
        sessionStorage.setItem("time", 0);
        document.getElementById("timer").innerText = "00:00:00";
    }
}

function updateTimer() {
    if (isRunning) {
        const elapsedTime = Date.now() - startTime + accumulatedTime;
        const seconds = Math.floor(elapsedTime / 1000);
        sessionStorage.setItem("time", elapsedTime);
        document.getElementById("timer").innerText = formatTime(seconds);

        requestAnimationFrame(updateTimer);
    }
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function generateComment(time, reason) {
    const spentSeconds = Math.floor(time / 1000);

    // Monta o comentário no formato desejado
    return `
${reason ? `Motivo: ${reason}\n` : ''}
/spend ${spentSeconds}s
/label ${currentLabel}
/unlabel Development
`;
}

function addLabel(label) {
    console.log(`Label adicionada: ${label}`);
    addComment(`/label ~"${label}"`);
    buttonCommentClick();
}

function removeLabel(label) {
    console.log(`Label removida: ${label}`);
    addComment(`/unlabel ~"${label}"`);
    buttonCommentClick();
}

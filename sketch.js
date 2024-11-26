const introContainer = document.getElementById("intro-container");
const gameContainer = document.getElementById("game-container");
const wordToType = document.getElementById("word-to-type");
const inputText = document.getElementById("input-text");
const timeDisplay = document.getElementById("time");
const pointsDisplay = document.getElementById("points");
const resultDisplay = document.getElementById("result");
const startBtn = document.getElementById("start-btn");
const playerNameInput = document.getElementById("player-name");
const rankingContainer = document.getElementById("ranking-container");
const rankingList = document.getElementById("ranking-list");
const backBtn = document.getElementById("back-btn");

const words = ["casa", "vaca", "começar", "gato", "livro", "bola", "amigo", "flor", "chuva", "carro"];

let currentWord = "";
let timer = 60;
let points = 0;
let timerInterval;
let isGameRunning = false;
let playerName = "";

let rankings = JSON.parse(localStorage.getItem("rankings")) || [];

function startGame() {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert("Por favor, insira seu nome para começar.");
        return;
    }

    introContainer.style.display = "none";
    gameContainer.style.display = "block";
    if (isGameRunning) return;
    isGameRunning = true;
    points = 0;
    pointsDisplay.textContent = points;
    resultDisplay.textContent = "";
    inputText.disabled = false;
    startBtn.disabled = true;
    inputText.value = "";
    startNewRound();
    startTimer();
}

function startNewRound() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordToType.textContent = `Digite a palavra: ${currentWord}`;
    inputText.value = "";
    inputText.focus();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        timeDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    inputText.disabled = true;
    resultDisplay.textContent = `Tempo esgotado! Você fez ${points} ponto(s).`;

    const existingPlayer = rankings.find(entry => entry.name === playerName);
    if (existingPlayer) {
        if (existingPlayer.score < points) {
            existingPlayer.score = points;
        }
    } else {
        rankings.push({ name: playerName, score: points });
    }

    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 10);
    localStorage.setItem("rankings", JSON.stringify(rankings));

    showRanking();
}

function showRanking() {
    rankingContainer.style.display = "block";
    gameContainer.style.display = "none";

    rankingList.innerHTML = "";
    rankings.forEach((entry, index) => {
        const rankingItem = document.createElement("div");
        rankingItem.classList.add("ranking-item");
        rankingItem.innerHTML = `<span>${index + 1}.</span> ${entry.name} - ${entry.score} pontos`;
        rankingList.appendChild(rankingItem);
    });
}

startBtn.addEventListener("click", startGame);
backBtn.addEventListener("click", () => {
    rankingContainer.style.display = "none";
    introContainer.style.display = "block";
    playerNameInput.value = "";
});

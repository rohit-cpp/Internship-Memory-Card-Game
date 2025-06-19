const emojis = ["🦁", "🐮", "🐶", "🐱", "🐹", "🐰", "🦜", "🐯"];
let cardValues = [...emojis, ...emojis];
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let timer;
let seconds = 0;

const grid = document.getElementById("card-grid");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const newGameBtn = document.getElementById("new-game");
const message = document.getElementById("congrats-message");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  clearInterval(timer);
  seconds = 0;
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Time: ${seconds}s`;
  }, 1000);
}

function resetGame() {
  shuffle(cardValues);
  grid.innerHTML = "";
  moves = 0;
  matchedPairs = 0;
  lockBoard = false;
  movesDisplay.textContent = "Moves: 0";
  message.style.display = "none";
  clearInterval(timer);
  timerDisplay.textContent = "Time: 0s";

  for (let value of cardValues) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${value}</div>
      </div>
    `;
    card.addEventListener("click", flipCard);
    grid.appendChild(card);
  }
  startTimer();
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;

  const firstValue = firstCard.querySelector(".card-back").textContent;
  const secondValue = secondCard.querySelector(".card-back").textContent;

  if (firstValue === secondValue) {
    disableCards();
    matchedPairs++;
    if (matchedPairs === emojis.length) {
      clearInterval(timer);
      message.style.display = "block";
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

newGameBtn.addEventListener("click", resetGame);
window.addEventListener("DOMContentLoaded", resetGame);

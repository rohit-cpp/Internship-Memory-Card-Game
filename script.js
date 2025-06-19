// DOM elements
const grid = document.getElementById("grid");
const movesCounter = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const newGameBtn = document.getElementById("new-game");
const messageBox = document.getElementById("message");

// Emoji set for pairs
const emojis = ["🍕", "🍔", "🍟", "🌭", "🍿", "🥗", "🍣", "🍩"];

let cards = [];
let firstCard = null;
let secondCard = null;
let moves = 0;
let matched = 0;
let timer = null;
let seconds = 0;

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Start or reset the game
function startGame() {
  grid.innerHTML = "";
  messageBox.style.display = "none";

  cards = shuffleArray([...emojis, ...emojis]); // Duplicate and shuffle emojis
  moves = 0;
  matched = 0;
  seconds = 0;
  clearInterval(timer);

  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = seconds;
    updateScore();
  }, 1000);

  movesCounter.textContent = moves;
  updateScore();

  // Create card elements
  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.emoji = emoji;
    card.dataset.index = index;

    card.innerHTML = `<div class="card-content">${emoji}</div>`;
    card.addEventListener("click", handleCardClick);

    grid.appendChild(card);
  });
}

// Handle card clicks and matching logic
function handleCardClick(e) {
  const clicked = e.currentTarget;

  // Prevent clicking same card or when 2 cards are already flipped
  if (clicked.classList.contains("revealed") || secondCard) return;

  clicked.classList.add("revealed");

  if (!firstCard) {
    firstCard = clicked;
    return;
  }

  secondCard = clicked;
  moves++;
  movesCounter.textContent = moves;
  updateScore();

  // Check for match
  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    matched++;
    firstCard = null;
    secondCard = null;

    if (matched === emojis.length) endGame();
  } else {
    // No match: flip cards back after short delay
    setTimeout(() => {
      firstCard.classList.remove("revealed");
      secondCard.classList.remove("revealed");
      firstCard = null;
      secondCard = null;
    }, 1000);
  }
}

// When all pairs are matched
function endGame() {
  clearInterval(timer);
  const score = calculateScore();
  messageBox.style.display = "block";
  messageBox.textContent = `🎉 You matched all cards in ${moves} moves and ${seconds}s! Your score: ${score}`;
}

// Scoring formula
function calculateScore() {
  return Math.max(1000 - moves * 10 - seconds * 5, 0);
}

// Update score display
function updateScore() {
  scoreDisplay.textContent = calculateScore();
}

// Event listeners
newGameBtn.addEventListener("click", startGame);
window.addEventListener("DOMContentLoaded", startGame);

import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { renderPlayerBoard, renderOpponentBoard } from "./ui.js";

const FLEET = [
  { name: "Carrier", length: 5 },
  { name: "Battleship", length: 4 },
  { name: "Cruiser", length: 3 },
  { name: "Submarine", length: 3 },
  { name: "Destroyer", length: 2 },
];

const player = new Player("Player");
const computer = new Player("Computer");

const playerBoardEl = document.getElementById("player");
const opponentBoardEl = document.getElementById("opponent");
const setupPanel = document.getElementById("setup-panel");
const setupStatus = document.getElementById("setup-status");
const orientBtn = document.getElementById("orient-btn");
const randomBtn = document.getElementById("random-btn");
const startBtn = document.getElementById("start-btn");

let phase = "setup"; // "battle" handlers refuse outside the battle phase
let orientation = "horizontal";
let currentShipIndex = 0;

placeRandomFleet(computer.board, FLEET);
renderPlayerBoard(playerBoardEl, player.board);
renderOpponentBoard(opponentBoardEl, computer.board);
updateSetupStatus();

orientBtn.addEventListener("click", () => {
  if (phase !== "setup") return; // Same lock as the panel mask, even via console
  orientation = orientation === "horizontal" ? "vertical" : "horizontal";
  orientBtn.textContent = `Orientation: ${capitalize(orientation)}`;
});

randomBtn.addEventListener("click", () => {
  if (phase !== "setup") return; // This button empties your ENTIRE fleet
  player.board.clearShips(); // Randomize is idempotent — press it as many times as you like
  placeRandomFleet(player.board, FLEET);
  currentShipIndex = FLEET.length;
  renderPlayerBoard(playerBoardEl, player.board);
  updateSetupStatus();
  startBtn.disabled = false;
});

playerBoardEl.addEventListener("click", (event) => {
  // Placement is forbidden outside "setup" — hiding the panel is UX; this guard is the lock
  if (phase !== "setup") return;
  const cell = event.target.closest(".cell");
  if (!cell) return;
  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);
  const shipDef = FLEET[currentShipIndex];
  if (!shipDef) return;

  try {
    player.board.placeShip(new Ship(shipDef.length), coordsFor(shipDef.length, x, y, orientation));
  } catch (err) {
    alert(err.message);
    return;
  }

  currentShipIndex += 1;
  renderPlayerBoard(playerBoardEl, player.board);
  updateSetupStatus();
  startBtn.disabled = currentShipIndex < FLEET.length;
});

startBtn.addEventListener("click", () => {
  if (currentShipIndex < FLEET.length) return;
  phase = "battle";
  setupPanel.hidden = true;
  renderOpponentBoard(opponentBoardEl, computer.board);
});

let gameOver = false;

opponentBoardEl.addEventListener("click", (event) => {
  if (phase !== "battle" || gameOver) return;

  // Event delegation survives the full re-render; listeners on cells would be wiped
  const cell = event.target.closest(".cell");
  if (!cell) return;

  const x = Number(cell.dataset.x);
  const y = Number(cell.dataset.y);

  const result = player.attack(computer.board, [x, y]);
  if (result === "already") {
    alert("You already attacked that cell. Pick another one.");
    return;
  }

  renderOpponentBoard(opponentBoardEl, computer.board);
  if (checkGameEnd()) return;

  computerMove();
  renderPlayerBoard(playerBoardEl, player.board);
  checkGameEnd();
});

function computerMove() {
  const size = computer.board.size;
  let result;
  let x, y;
  // The board is the only legality oracle; loop until it doesn't answer "already"
  do {
    x = Math.floor(Math.random() * size);
    y = Math.floor(Math.random() * size);
    result = computer.attack(player.board, [x, y]);
  } while (result === "already");
}

function checkGameEnd() {
  if (computer.board.allSunk()) {
    endGame("Victory! You sunk every enemy ship.");
    return true;
  }
  if (player.board.allSunk()) {
    endGame("Defeat... your fleet was sunk.");
    return true;
  }
  return false;
}

function endGame(message) {
  gameOver = true;
  alert(message);
}

function coordsFor(length, x, y, orientation) {
  const coords = [];
  for (let i = 0; i < length; i++) {
    coords.push(orientation === "horizontal" ? [x + i, y] : [x, y + i]);
  }
  return coords;
}

function placeRandomFleet(board, fleet) {
  for (const { length } of fleet) {
    let placed = false;
    while (!placed) { // Rejection sampling; tiny fleet, big board — retries terminate quickly
      const horizontal = Math.random() < 0.5;
      const orientation = horizontal ? "horizontal" : "vertical";
      const maxX = horizontal ? board.size - length + 1 : board.size;
      const maxY = horizontal ? board.size : board.size - length + 1;
      const x = Math.floor(Math.random() * maxX);
      const y = Math.floor(Math.random() * maxY);
      try {
        board.placeShip(new Ship(length), coordsFor(length, x, y, orientation));
        placed = true;
      } catch {
        // Overlap or out of bounds: roll again; causes are random so retries succeed fast
      }
    }
  }
}

function updateSetupStatus() {
  const remaining = FLEET[currentShipIndex];
  setupStatus.textContent = remaining
    ? `Place your ${remaining.name} (${remaining.length} cells) — click a cell on your board.`
    : "All ships placed! Press Start game.";
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

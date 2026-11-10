import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { renderPlayerBoard, renderOpponentBoard } from "./ui.js";

const player = new Player("Player");
const computer = new Player("Computer");

player.placeShip(new Ship(3), [[0, 0], [1, 0], [2, 0]]);
player.placeShip(new Ship(2), [[0, 1], [1, 1]]);
computer.placeShip(new Ship(3), [[5, 5], [6, 5], [7, 5]]);
computer.placeShip(new Ship(2), [[5, 6], [6, 6]]);

const playerBoardEl = document.getElementById("player");
const opponentBoardEl = document.getElementById("opponent");

renderPlayerBoard(playerBoardEl, player.board);
renderOpponentBoard(opponentBoardEl, computer.board);

let gameOver = false;

opponentBoardEl.addEventListener("click", (event) => {
  if (gameOver) return;

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

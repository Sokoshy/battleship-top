import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { renderPlayerBoard, renderOpponentBoard } from "./ui.js";

const player = new Player("Player");
const computer = new Player("Computer");

// Why: predetermined ships for step 4; player placement comes in step 5.
player.placeShip(new Ship(3), [[0, 0], [1, 0], [2, 0]]);
player.placeShip(new Ship(2), [[0, 1], [1, 1]]);
computer.placeShip(new Ship(3), [[5, 5], [6, 5], [7, 5]]);
computer.placeShip(new Ship(2), [[5, 6], [6, 6]]);

renderPlayerBoard(document.getElementById("player"), player.board);
renderOpponentBoard(document.getElementById("opponent"), computer.board);

import { Gameboard } from "./gameboard.js";
export class Player{
  constructor(name){
    this.name = name;
    this.board = new Gameboard(10);
  }
  placeShip(ship, coordsArr){
    this.board.placeShip(ship, coordsArr);
  }
  attack(opponentBoard, coords){
    return opponentBoard.receiveAttack(coords);
  }
}

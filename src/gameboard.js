export class Gameboard {
  constructor(size){
    this.size = size;
    this.grid = createGrid(size);
    this.shipPos = new Array();
    this.missedAttacks = new Array();
    this.alreadyHit = new Array();
  }

  placeShip(ship, coordsArr){
    if(ship.length !== coordsArr.length){
      throw new Error("The size of the ship does not correspond to the number of coordinates gives");
    }
    for (const [x, y] of coordsArr) {
      if(x > this.size - 1 || x < 0 || y > this.size - 1 || y < 0) throw new Error("This coordinates is outside of the grid");
      this.grid[y][x] = ship;
    }

    this.shipPos.push({ ship, coords: coordsArr });
  }

  receiveAttack(coords){
    if(coords === null || coords.length < 2) throw Error("Invalide or no coordinates");
    if(coords[0] > this.size - 1 || coords[0] < 0 || coords[1] > this.size - 1 || coords[1] < 0) throw new Error("This coordinates is outside of the grid");

    if(this.alreadyHit.length !== 0){
      for (const existingHit of this.alreadyHit) {
        if(existingHit.toString() === coords.toString()){
          return "already";
        }
      }
    }
    if(this.missedAttacks.length !== 0){
      for (const missAttack of this.missedAttacks) {
        if(missAttack.toString() === coords.toString()){
          return "already";
        }
      }
    }

    if(this.shipPos.length === 0) {
      this.missedAttacks.push(coords);
      return "miss";
    }

    if(this.grid[coords[1]][coords[0]] === null){
      this.missedAttacks.push(coords);
      return "miss";
    }

    for (const actualShip of this.shipPos) {
      for (const shipCoord of actualShip.coords) {
        if(shipCoord.toString() === coords.toString()){
          actualShip.ship.hit();
          this.alreadyHit.push(coords);
          return "hit";
        }
      }
    }
  }

  allSunk(){
    if(this.shipPos.length === 0) return false;
    for (const actualShip of this.shipPos) {
      if(!actualShip.ship.isSunk()){
        return false;
      }
    }
    return true;
  }

  getHits() {
    const hitCopy = [...this.alreadyHit];
    return hitCopy;
  }

  getMissedAttacks() {
    const missAttackCopy = [...this.missedAttacks];
    return missAttackCopy;
  }

  getShipPlacements() {
    const shipPosCopy = [...this.shipPos];
    return shipPosCopy;
  }
}

function createGrid(size){
  const grid = [ ];

  for (let i = 0; i < size; i++) {
    const row = [ ];
    for (let j = 0; j < size; j++) {
      row.push(null);
    }
    grid.push(row);
  }
  return grid
}

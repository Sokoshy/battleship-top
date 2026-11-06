export class Ship {
  constructor(length) {
    this.length = length;
    this.numbHit = 0;
    this.sunk = false;
  }

  hit(){
    this.numbHit++;
  }

  isSunk() {
    if(this.numbHit >= this.length){
      this.sunk = true
      return this.sunk;
    }
    return this.sunk;
  }
}

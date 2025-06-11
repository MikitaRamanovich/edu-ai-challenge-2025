export class Ship {
  constructor(locations, length = 3) {
    this.locations = [...locations]; // Use spread operator for immutability
    this.hits = new Array(length).fill(false);
    this.length = length;
  }

  hit(location) {
    const index = this.locations.indexOf(location);
    if (index >= 0 && !this.hits[index]) {
      this.hits[index] = true;
      return true;
    }
    return false;
  }

  isSunk() {
    return this.hits.every(hit => hit);
  }

  isHit(location) {
    const index = this.locations.indexOf(location);
    return index >= 0 && this.hits[index];
  }

  hasLocation(location) {
    return this.locations.includes(location);
  }

  getHitCount() {
    return this.hits.filter(hit => hit).length;
  }
} 
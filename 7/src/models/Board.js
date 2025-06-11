import { Ship } from './Ship.js';

export class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = Array(size).fill(null).map(() => Array(size).fill('~'));
    this.ships = [];
  }

  static createLocation(row, col) {
    return `${row}${col}`;
  }

  static parseLocation(location) {
    return {
      row: parseInt(location[0]),
      col: parseInt(location[1])
    };
  }

  isValidLocation(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  canPlaceShip(startRow, startCol, length, orientation) {
    const locations = this.generateShipLocations(startRow, startCol, length, orientation);
    
    return locations.every(location => {
      const { row, col } = Board.parseLocation(location);
      return this.isValidLocation(row, col) && this.grid[row][col] === '~';
    });
  }

  generateShipLocations(startRow, startCol, length, orientation) {
    const locations = [];
    
    for (let i = 0; i < length; i++) {
      const row = orientation === 'horizontal' ? startRow : startRow + i;
      const col = orientation === 'horizontal' ? startCol + i : startCol;
      locations.push(Board.createLocation(row, col));
    }
    
    return locations;
  }

  placeShip(startRow, startCol, length, orientation, markOnGrid = false) {
    if (!this.canPlaceShip(startRow, startCol, length, orientation)) {
      throw new Error('Cannot place ship at this location');
    }

    const locations = this.generateShipLocations(startRow, startCol, length, orientation);
    const ship = new Ship(locations, length);
    
    this.ships.push(ship);
    
    if (markOnGrid) {
      locations.forEach(location => {
        const { row, col } = Board.parseLocation(location);
        this.grid[row][col] = 'S';
      });
    }
    
    return ship;
  }

  placeShipsRandomly(numShips, shipLength) {
    let placedShips = 0;
    const maxAttempts = 1000;
    let attempts = 0;

    while (placedShips < numShips && attempts < maxAttempts) {
      attempts++;
      
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const maxRow = orientation === 'horizontal' ? this.size : this.size - shipLength + 1;
      const maxCol = orientation === 'horizontal' ? this.size - shipLength + 1 : this.size;
      
      const startRow = Math.floor(Math.random() * maxRow);
      const startCol = Math.floor(Math.random() * maxCol);

      try {
        this.placeShip(startRow, startCol, shipLength, orientation, true);
        placedShips++;
      } catch (error) {
        // Try again with different position
        continue;
      }
    }

    if (placedShips < numShips) {
      throw new Error(`Could only place ${placedShips} out of ${numShips} ships`);
    }

    return placedShips;
  }

  processGuess(location) {
    const { row, col } = Board.parseLocation(location);
    
    if (!this.isValidLocation(row, col)) {
      throw new Error('Invalid location');
    }

    // Check if location already guessed
    if (this.grid[row][col] === 'X' || this.grid[row][col] === 'O') {
      return { hit: false, sunk: false, alreadyGuessed: true };
    }

    // Check for hit
    const hitShip = this.ships.find(ship => ship.hasLocation(location));
    
    if (hitShip) {
      hitShip.hit(location);
      this.grid[row][col] = 'X';
      return { 
        hit: true, 
        sunk: hitShip.isSunk(), 
        alreadyGuessed: false,
        ship: hitShip
      };
    } else {
      this.grid[row][col] = 'O';
      return { hit: false, sunk: false, alreadyGuessed: false };
    }
  }

  getActiveShipsCount() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  areAllShipsSunk() {
    return this.ships.every(ship => ship.isSunk());
  }

  getDisplayGrid() {
    return this.grid.map(row => [...row]);
  }
} 
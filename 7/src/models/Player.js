import { Board } from './Board.js';

export class Player {
  constructor(name, boardSize = 10) {
    this.name = name;
    this.board = new Board(boardSize);
    this.opponentBoard = new Board(boardSize);
    this.guesses = new Set(); // Use Set for O(1) lookup
  }

  setupShips(numShips, shipLength) {
    return this.board.placeShipsRandomly(numShips, shipLength);
  }

  validateGuess(location) {
    if (!location || location.length !== 2) {
      throw new Error('Input must be exactly two digits (e.g., 00, 34, 98)');
    }

    const row = parseInt(location[0]);
    const col = parseInt(location[1]);

    if (isNaN(row) || isNaN(col) || !this.opponentBoard.isValidLocation(row, col)) {
      throw new Error(`Please enter valid row and column numbers between 0 and ${this.board.size - 1}`);
    }

    if (this.guesses.has(location)) {
      throw new Error('You already guessed that location!');
    }

    return { row, col };
  }

  makeGuess(location, opponentBoard) {
    this.validateGuess(location);
    this.guesses.add(location);

    const result = opponentBoard.processGuess(location);
    
    // Update our view of opponent's board
    const { row, col } = Board.parseLocation(location);
    this.opponentBoard.grid[row][col] = result.hit ? 'X' : 'O';

    return result;
  }

  receiveAttack(location) {
    return this.board.processGuess(location);
  }

  hasWon() {
    return this.opponentBoard.areAllShipsSunk();
  }

  hasLost() {
    return this.board.areAllShipsSunk();
  }

  getShipsRemaining() {
    return this.board.getActiveShipsCount();
  }

  getOpponentShipsRemaining() {
    return this.opponentBoard.getActiveShipsCount();
  }
} 
import { Player } from './Player.js';
import { Board } from './Board.js';

export class CpuPlayer extends Player {
  constructor(name = 'CPU', boardSize = 10) {
    super(name, boardSize);
    this.mode = 'hunt'; // 'hunt' or 'target'
    this.targetQueue = [];
    this.lastHit = null;
    this.lastGuess = null; // Track last guess for display purposes
  }

  generateRandomGuess() {
    const availableLocations = [];
    
    for (let row = 0; row < this.board.size; row++) {
      for (let col = 0; col < this.board.size; col++) {
        const location = Board.createLocation(row, col);
        if (!this.guesses.has(location)) {
          availableLocations.push(location);
        }
      }
    }

    if (availableLocations.length === 0) {
      throw new Error('No available locations to guess');
    }

    const randomIndex = Math.floor(Math.random() * availableLocations.length);
    return availableLocations[randomIndex];
  }

  getAdjacentLocations(location) {
    const { row, col } = Board.parseLocation(location);
    const adjacent = [
      { r: row - 1, c: col },
      { r: row + 1, c: col },
      { r: row, c: col - 1 },
      { r: row, c: col + 1 }
    ];

    return adjacent
      .filter(({ r, c }) => this.opponentBoard.isValidLocation(r, c))
      .map(({ r, c }) => Board.createLocation(r, c))
      .filter(loc => !this.guesses.has(loc));
  }

  addTargetsToQueue(location) {
    const adjacentLocations = this.getAdjacentLocations(location);
    
    adjacentLocations.forEach(loc => {
      // Only add if not already in queue and not already guessed
      if (!this.targetQueue.includes(loc) && !this.guesses.has(loc)) {
        this.targetQueue.push(loc);
      }
    });
  }

  makeSmartGuess(opponentBoard) {
    let location;

    // Target mode: try locations from target queue
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      location = this.targetQueue.shift();
      
      // Validate the location hasn't been guessed already
      if (this.guesses.has(location)) {
        if (this.targetQueue.length === 0) {
          this.mode = 'hunt';
        }
        return this.makeSmartGuess(opponentBoard); // Recursive call to try again
      }
    } else {
      // Hunt mode: make random guess
      this.mode = 'hunt';
      location = this.generateRandomGuess();
    }

    // Store the guess and add to guesses set
    this.lastGuess = location;
    this.guesses.add(location);
    const result = opponentBoard.processGuess(location);

    // Update our view of opponent's board
    const { row, col } = Board.parseLocation(location);
    this.opponentBoard.grid[row][col] = result.hit ? 'X' : 'O';

    // Handle the result
    if (result.hit) {
      this.lastHit = location;
      
      if (result.sunk) {
        // Ship sunk, back to hunt mode
        this.mode = 'hunt';
        this.targetQueue = [];
      } else {
        // Hit but not sunk, switch to target mode
        this.mode = 'target';
        this.addTargetsToQueue(location);
      }
    } else {
      // Miss - if we were in target mode and queue is empty, switch to hunt
      if (this.mode === 'target' && this.targetQueue.length === 0) {
        this.mode = 'hunt';
      }
    }

    return { location, result };
  }

  // Override the makeGuess method to use smart AI
  makeGuess(location, opponentBoard) {
    if (location) {
      // If location is provided, use parent method (for testing)
      this.lastGuess = location;
      return super.makeGuess(location, opponentBoard);
    }
    
    // Otherwise, make a smart guess
    const { location: guessLocation, result } = this.makeSmartGuess(opponentBoard);
    return result;
  }

  getLastGuess() {
    return this.lastGuess;
  }

  getCurrentMode() {
    return this.mode;
  }

  getTargetQueueSize() {
    return this.targetQueue.length;
  }
} 
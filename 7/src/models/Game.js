import { Player } from './Player.js';
import { CpuPlayer } from './CpuPlayer.js';
import { GameUI } from '../services/GameUI.js';
import readline from 'readline';

export class Game {
  constructor(config = {}) {
    this.config = {
      boardSize: config.boardSize || 10,
      numShips: config.numShips || 3,
      shipLength: config.shipLength || 3,
      ...config
    };
    
    this.player = new Player('Player', this.config.boardSize);
    this.cpu = new CpuPlayer('CPU', this.config.boardSize);
    this.isGameOver = false;
    this.winner = null;
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async initializeGame() {
    try {
      // Setup ships for both players
      this.player.setupShips(this.config.numShips, this.config.shipLength);
      GameUI.printShipPlacement(this.player.name, this.config.numShips);
      
      this.cpu.setupShips(this.config.numShips, this.config.shipLength);
      GameUI.printShipPlacement(this.cpu.name, this.config.numShips);
      
      GameUI.printGameStart(this.config.numShips);
      
    } catch (error) {
      GameUI.printError(`Failed to initialize game: ${error.message}`);
      throw error;
    }
  }

  checkGameEnd() {
    if (this.player.hasLost()) {
      this.isGameOver = true;
      this.winner = this.cpu;
      return true;
    }
    
    if (this.cpu.hasLost()) {
      this.isGameOver = true;
      this.winner = this.player;
      return true;
    }
    
    return false;
  }

  async handlePlayerTurn() {
    let validMove = false;
    
    while (!validMove && !this.isGameOver) {
      try {
        GameUI.printBoard(this.player.board, this.player.opponentBoard);
        GameUI.printGameStats(this.player, this.cpu);
        
        const input = await GameUI.getPlayerInput(this.rl);
        
        if (!input) {
          GameUI.printError("Please enter a valid guess.");
          continue;
        }

        const result = this.player.makeGuess(input, this.cpu.board);
        GameUI.printTurnResult(this.player.name, input, result);
        
        validMove = true;
        
        // Check if game ends after player turn
        if (this.checkGameEnd()) {
          return;
        }
        
      } catch (error) {
        GameUI.printError(error.message);
      }
    }
  }

  async handleCpuTurn() {
    if (this.isGameOver) return;

    try {
      GameUI.printCpuThinking();
      
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = this.cpu.makeGuess(null, this.player.board);
      const lastGuess = this.cpu.getLastGuess();
      
      // Ensure we have valid coordinates
      if (!lastGuess) {
        throw new Error('CPU failed to make a valid guess');
      }
      
      GameUI.printTurnResult(this.cpu.name, lastGuess, result);
      
      this.checkGameEnd();
      
    } catch (error) {
      GameUI.printError(`CPU turn error: ${error.message}`);
    }
  }

  async gameLoop() {
    while (!this.isGameOver) {
      // Player turn
      await this.handlePlayerTurn();
      
      if (this.isGameOver) break;
      
      // CPU turn
      await this.handleCpuTurn();
    }
    
    // Game ended
    GameUI.printBoard(this.player.board, this.player.opponentBoard, 'Final Board');
    GameUI.printGameEnd(this.winner, this.winner === this.player ? this.cpu : this.player);
  }

  async start() {
    try {
      await this.initializeGame();
      await this.gameLoop();
    } catch (error) {
      GameUI.printError(`Game error: ${error.message}`);
    } finally {
      this.cleanup();
    }
  }

  cleanup() {
    if (this.rl) {
      this.rl.close();
    }
  }

  // Methods for testing
  getPlayer() {
    return this.player;
  }

  getCpu() {
    return this.cpu;
  }

  getConfig() {
    return { ...this.config };
  }

  isGameFinished() {
    return this.isGameOver;
  }

  getWinner() {
    return this.winner;
  }
} 
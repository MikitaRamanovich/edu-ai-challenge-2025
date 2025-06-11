import { jest } from '@jest/globals';
import { Game } from '../../src/models/Game.js';
import { Player } from '../../src/models/Player.js';
import { CpuPlayer } from '../../src/models/CpuPlayer.js';

// Mock readline to avoid actual I/O during tests
jest.mock('readline', () => ({
  createInterface: jest.fn(() => ({
    close: jest.fn(),
    question: jest.fn()
  }))
}));

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game({
      boardSize: 5,
      numShips: 2,
      shipLength: 2
    });
  });

  afterEach(() => {
    if (game && game.rl) {
      game.cleanup();
    }
  });

  describe('constructor', () => {
    test('should create game with default configuration', () => {
      const defaultGame = new Game();
      const config = defaultGame.getConfig();
      expect(config.boardSize).toBe(10);
      expect(config.numShips).toBe(3);
      expect(config.shipLength).toBe(3);
    });

    test('should create game with custom configuration', () => {
      const config = game.getConfig();
      expect(config.boardSize).toBe(5);
      expect(config.numShips).toBe(2);
      expect(config.shipLength).toBe(2);
    });

    test('should initialize players with correct board size', () => {
      expect(game.getPlayer()).toBeInstanceOf(Player);
      expect(game.getCpu()).toBeInstanceOf(CpuPlayer);
      expect(game.getPlayer().board.size).toBe(5);
      expect(game.getCpu().board.size).toBe(5);
    });

    test('should initialize game state', () => {
      expect(game.isGameFinished()).toBe(false);
      expect(game.getWinner()).toBeNull();
    });
  });

  describe('initializeGame', () => {
    test('should setup ships for both players', async () => {
      await game.initializeGame();
      
      expect(game.getPlayer().board.ships).toHaveLength(2);
      expect(game.getCpu().board.ships).toHaveLength(2);
    });

    test('should handle initialization errors gracefully', async () => {
      // Mock a failure in ship placement
      jest.spyOn(game.getPlayer(), 'setupShips').mockImplementation(() => {
        throw new Error('Ship placement failed');
      });

      await expect(game.initializeGame()).rejects.toThrow('Ship placement failed');
    });
  });

  describe('checkGameEnd', () => {
    beforeEach(async () => {
      await game.initializeGame();
    });

    test('should return false when game is ongoing', () => {
      expect(game.checkGameEnd()).toBe(false);
      expect(game.isGameFinished()).toBe(false);
    });

    test('should detect player win', () => {
      // Sink all CPU ships
      game.getCpu().board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          ship.hit(location);
        });
      });

      expect(game.checkGameEnd()).toBe(true);
      expect(game.isGameFinished()).toBe(true);
      expect(game.getWinner()).toBe(game.getPlayer());
    });

    test('should detect CPU win', () => {
      // Sink all player ships
      game.getPlayer().board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          ship.hit(location);
        });
      });

      expect(game.checkGameEnd()).toBe(true);
      expect(game.isGameFinished()).toBe(true);
      expect(game.getWinner()).toBe(game.getCpu());
    });
  });

  describe('handleCpuTurn', () => {
    beforeEach(async () => {
      await game.initializeGame();
    });

    test('should process CPU turn without errors', async () => {
      await expect(game.handleCpuTurn()).resolves.not.toThrow();
    });

    test('should not process turn if game is over', async () => {
      game.isGameOver = true;
      const initialGuessCount = game.getCpu().guesses.size;
      
      await game.handleCpuTurn();
      
      expect(game.getCpu().guesses.size).toBe(initialGuessCount);
    });
  });

  describe('game flow integration', () => {
    test('should handle complete game scenario', async () => {
      await game.initializeGame();
      
      expect(game.getPlayer().board.ships).toHaveLength(2);
      expect(game.getCpu().board.ships).toHaveLength(2);
      
      // Simulate game progress by manually hitting some ships
      const playerShip = game.getPlayer().board.ships[0];
      const cpuShip = game.getCpu().board.ships[0];
      
      // Hit but don't sink ships
      playerShip.hit(playerShip.locations[0]);
      cpuShip.hit(cpuShip.locations[0]);
      
      expect(game.checkGameEnd()).toBe(false);
      
      // Now sink all ships to end game
      game.getPlayer().board.ships.forEach(ship => {
        ship.locations.forEach(location => {
          ship.hit(location);
        });
      });
      
      expect(game.checkGameEnd()).toBe(true);
      expect(game.getWinner()).toBe(game.getCpu());
    });
  });

  describe('configuration validation', () => {
    test('should handle edge case configurations', () => {
      const edgeGame = new Game({
        boardSize: 3,
        numShips: 1,
        shipLength: 2
      });
      
      expect(edgeGame.getConfig().boardSize).toBe(3);
      expect(edgeGame.getConfig().numShips).toBe(1);
      expect(edgeGame.getConfig().shipLength).toBe(2);
    });

    test('should merge custom config with defaults', () => {
      const partialGame = new Game({
        boardSize: 8
      });
      
      const config = partialGame.getConfig();
      expect(config.boardSize).toBe(8);
      expect(config.numShips).toBe(3); // default
      expect(config.shipLength).toBe(3); // default
    });
  });

  describe('cleanup', () => {
    test('should cleanup readline interface', () => {
      const closeSpy = jest.spyOn(game.rl, 'close');
      game.cleanup();
      expect(closeSpy).toHaveBeenCalled();
    });

    test('should handle cleanup when rl is null', () => {
      game.rl = null;
      expect(() => game.cleanup()).not.toThrow();
    });
  });
}); 
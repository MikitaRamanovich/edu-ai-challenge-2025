import { Player } from '../../src/models/Player.js';
import { Board } from '../../src/models/Board.js';

describe('Player', () => {
  let player;
  let mockOpponentBoard;

  beforeEach(() => {
    player = new Player('TestPlayer', 5);
    mockOpponentBoard = new Board(5);
    mockOpponentBoard.placeShip(0, 0, 2, 'horizontal');
  });

  describe('constructor', () => {
    test('should create player with correct name and board size', () => {
      expect(player.name).toBe('TestPlayer');
      expect(player.board.size).toBe(5);
      expect(player.opponentBoard.size).toBe(5);
    });

    test('should create player with default board size', () => {
      const defaultPlayer = new Player('DefaultPlayer');
      expect(defaultPlayer.board.size).toBe(10);
    });

    test('should initialize empty guesses set', () => {
      expect(player.guesses.size).toBe(0);
    });
  });

  describe('setupShips', () => {
    test('should place ships on player board', () => {
      const placed = player.setupShips(2, 2);
      expect(placed).toBe(2);
      expect(player.board.ships).toHaveLength(2);
    });
  });

  describe('validateGuess', () => {
    test('should validate correct guess format', () => {
      const result = player.validateGuess('12');
      expect(result).toEqual({ row: 1, col: 2 });
    });

    test('should throw error for invalid length', () => {
      expect(() => player.validateGuess('1')).toThrow('Input must be exactly two digits');
      expect(() => player.validateGuess('123')).toThrow('Input must be exactly two digits');
      expect(() => player.validateGuess('')).toThrow('Input must be exactly two digits');
    });

    test('should throw error for non-numeric input', () => {
      expect(() => player.validateGuess('ab')).toThrow('Please enter valid row and column numbers');
    });

    test('should throw error for out of bounds coordinates', () => {
      expect(() => player.validateGuess('55')).toThrow('Please enter valid row and column numbers');
      expect(() => player.validateGuess('99')).toThrow('Please enter valid row and column numbers');
    });

    test('should throw error for already guessed location', () => {
      player.guesses.add('12');
      expect(() => player.validateGuess('12')).toThrow('You already guessed that location!');
    });
  });

  describe('makeGuess', () => {
    test('should process valid guess and return result', () => {
      const result = player.makeGuess('00', mockOpponentBoard);
      expect(result.hit).toBe(true);
      expect(player.guesses.has('00')).toBe(true);
      expect(player.opponentBoard.grid[0][0]).toBe('X');
    });

    test('should process miss and update opponent board view', () => {
      const result = player.makeGuess('44', mockOpponentBoard);
      expect(result.hit).toBe(false);
      expect(player.guesses.has('44')).toBe(true);
      expect(player.opponentBoard.grid[4][4]).toBe('O');
    });

    test('should throw error for invalid guess', () => {
      expect(() => player.makeGuess('99', mockOpponentBoard)).toThrow();
    });

    test('should throw error for duplicate guess', () => {
      player.makeGuess('00', mockOpponentBoard);
      expect(() => player.makeGuess('00', mockOpponentBoard)).toThrow('You already guessed that location!');
    });
  });

  describe('receiveAttack', () => {
    beforeEach(() => {
      player.board.placeShip(0, 0, 2, 'horizontal', true);
    });

    test('should process attack on player board', () => {
      const result = player.receiveAttack('00');
      expect(result.hit).toBe(true);
      expect(player.board.grid[0][0]).toBe('X');
    });

    test('should process miss on player board', () => {
      const result = player.receiveAttack('44');
      expect(result.hit).toBe(false);
      expect(player.board.grid[4][4]).toBe('O');
    });
  });

  describe('hasWon', () => {
    test('should return false when opponent has active ships', () => {
      // Add ships to opponent board so player hasn't won yet
      player.opponentBoard.placeShip(0, 0, 2, 'horizontal');
      expect(player.hasWon()).toBe(false);
    });

    test('should return true when all opponent ships are sunk', () => {
      player.opponentBoard.placeShip(0, 0, 2, 'horizontal');
      player.opponentBoard.processGuess('00');
      player.opponentBoard.processGuess('01');
      expect(player.hasWon()).toBe(true);
    });
  });

  describe('hasLost', () => {
    test('should return false when player has active ships', () => {
      player.board.placeShip(0, 0, 2, 'horizontal');
      expect(player.hasLost()).toBe(false);
    });

    test('should return true when all player ships are sunk', () => {
      player.board.placeShip(0, 0, 2, 'horizontal');
      player.board.processGuess('00');
      player.board.processGuess('01');
      expect(player.hasLost()).toBe(true);
    });
  });

  describe('getShipsRemaining', () => {
    test('should return correct count of remaining ships', () => {
      player.board.placeShip(0, 0, 2, 'horizontal');
      player.board.placeShip(2, 0, 2, 'horizontal');
      expect(player.getShipsRemaining()).toBe(2);
      
      player.board.processGuess('00');
      player.board.processGuess('01');
      expect(player.getShipsRemaining()).toBe(1);
    });
  });

  describe('getOpponentShipsRemaining', () => {
    test('should return correct count of opponent ships remaining', () => {
      player.opponentBoard.placeShip(0, 0, 2, 'horizontal');
      player.opponentBoard.placeShip(2, 0, 2, 'horizontal');
      expect(player.getOpponentShipsRemaining()).toBe(2);
      
      player.opponentBoard.processGuess('00');
      player.opponentBoard.processGuess('01');
      expect(player.getOpponentShipsRemaining()).toBe(1);
    });
  });
}); 
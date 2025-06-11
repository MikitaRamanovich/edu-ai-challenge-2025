import { Board } from '../../src/models/Board.js';
import { Ship } from '../../src/models/Ship.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board(5); // Smaller board for easier testing
  });

  describe('constructor', () => {
    test('should create board with default size 10', () => {
      const defaultBoard = new Board();
      expect(defaultBoard.size).toBe(10);
      expect(defaultBoard.grid).toHaveLength(10);
      expect(defaultBoard.grid[0]).toHaveLength(10);
    });

    test('should create board with custom size', () => {
      expect(board.size).toBe(5);
      expect(board.grid).toHaveLength(5);
      expect(board.grid[0]).toHaveLength(5);
    });

    test('should initialize grid with water tiles', () => {
      board.grid.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBe('~');
        });
      });
    });

    test('should initialize empty ships array', () => {
      expect(board.ships).toEqual([]);
    });
  });

  describe('static methods', () => {
    test('createLocation should format coordinates correctly', () => {
      expect(Board.createLocation(1, 2)).toBe('12');
      expect(Board.createLocation(0, 0)).toBe('00');
    });

    test('parseLocation should parse coordinates correctly', () => {
      expect(Board.parseLocation('12')).toEqual({ row: 1, col: 2 });
      expect(Board.parseLocation('00')).toEqual({ row: 0, col: 0 });
    });
  });

  describe('isValidLocation', () => {
    test('should return true for valid coordinates', () => {
      expect(board.isValidLocation(0, 0)).toBe(true);
      expect(board.isValidLocation(2, 3)).toBe(true);
      expect(board.isValidLocation(4, 4)).toBe(true);
    });

    test('should return false for invalid coordinates', () => {
      expect(board.isValidLocation(-1, 0)).toBe(false);
      expect(board.isValidLocation(0, -1)).toBe(false);
      expect(board.isValidLocation(5, 0)).toBe(false);
      expect(board.isValidLocation(0, 5)).toBe(false);
    });
  });

  describe('generateShipLocations', () => {
    test('should generate horizontal ship locations', () => {
      const locations = board.generateShipLocations(1, 1, 3, 'horizontal');
      expect(locations).toEqual(['11', '12', '13']);
    });

    test('should generate vertical ship locations', () => {
      const locations = board.generateShipLocations(1, 1, 3, 'vertical');
      expect(locations).toEqual(['11', '21', '31']);
    });
  });

  describe('canPlaceShip', () => {
    test('should return true for valid ship placement', () => {
      expect(board.canPlaceShip(0, 0, 3, 'horizontal')).toBe(true);
      expect(board.canPlaceShip(0, 0, 3, 'vertical')).toBe(true);
    });

    test('should return false for ship extending beyond board', () => {
      expect(board.canPlaceShip(0, 3, 3, 'horizontal')).toBe(false);
      expect(board.canPlaceShip(3, 0, 3, 'vertical')).toBe(false);
    });

    test('should return false for overlapping ships', () => {
      board.placeShip(0, 0, 3, 'horizontal', true);
      expect(board.canPlaceShip(0, 0, 3, 'vertical')).toBe(false);
      expect(board.canPlaceShip(0, 1, 2, 'horizontal')).toBe(false);
    });
  });

  describe('placeShip', () => {
    test('should place ship and return ship object', () => {
      const ship = board.placeShip(0, 0, 3, 'horizontal');
      expect(ship).toBeInstanceOf(Ship);
      expect(ship.locations).toEqual(['00', '01', '02']);
      expect(board.ships).toHaveLength(1);
    });

    test('should mark ship on grid when requested', () => {
      board.placeShip(0, 0, 3, 'horizontal', true);
      expect(board.grid[0][0]).toBe('S');
      expect(board.grid[0][1]).toBe('S');
      expect(board.grid[0][2]).toBe('S');
    });

    test('should not mark ship on grid when not requested', () => {
      board.placeShip(0, 0, 3, 'horizontal', false);
      expect(board.grid[0][0]).toBe('~');
      expect(board.grid[0][1]).toBe('~');
      expect(board.grid[0][2]).toBe('~');
    });

    test('should throw error for invalid placement', () => {
      expect(() => {
        board.placeShip(0, 3, 3, 'horizontal');
      }).toThrow('Cannot place ship at this location');
    });
  });

  describe('placeShipsRandomly', () => {
    test('should place requested number of ships', () => {
      const placed = board.placeShipsRandomly(2, 2);
      expect(placed).toBe(2);
      expect(board.ships).toHaveLength(2);
    });

    test('should mark ships on grid', () => {
      board.placeShipsRandomly(1, 2);
      let shipCount = 0;
      board.grid.forEach(row => {
        row.forEach(cell => {
          if (cell === 'S') shipCount++;
        });
      });
      expect(shipCount).toBe(2);
    });

    test('should throw error if unable to place all ships', () => {
      // Try to place too many ships on small board
      expect(() => {
        board.placeShipsRandomly(20, 3);
      }).toThrow();
    });
  });

  describe('processGuess', () => {
    beforeEach(() => {
      board.placeShip(0, 0, 3, 'horizontal', true);
    });

    test('should return hit result for ship location', () => {
      const result = board.processGuess('00');
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(result.alreadyGuessed).toBe(false);
      expect(board.grid[0][0]).toBe('X');
    });

    test('should return miss result for empty location', () => {
      const result = board.processGuess('44');
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(result.alreadyGuessed).toBe(false);
      expect(board.grid[4][4]).toBe('O');
    });

    test('should return sunk result when ship is fully hit', () => {
      board.processGuess('00');
      board.processGuess('01');
      const result = board.processGuess('02');
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
    });

    test('should return already guessed for repeated guess', () => {
      board.processGuess('00');
      const result = board.processGuess('00');
      expect(result.alreadyGuessed).toBe(true);
    });

    test('should throw error for invalid location', () => {
      expect(() => {
        board.processGuess('99');
      }).toThrow('Invalid location');
    });
  });

  describe('getActiveShipsCount', () => {
    test('should return 0 for new board', () => {
      expect(board.getActiveShipsCount()).toBe(0);
    });

    test('should return correct count of active ships', () => {
      board.placeShip(0, 0, 2, 'horizontal');
      board.placeShip(2, 0, 2, 'horizontal');
      expect(board.getActiveShipsCount()).toBe(2);
    });

    test('should not count sunk ships', () => {
      board.placeShip(0, 0, 2, 'horizontal');
      board.placeShip(2, 0, 2, 'horizontal');
      board.processGuess('00');
      board.processGuess('01');
      expect(board.getActiveShipsCount()).toBe(1);
    });
  });

  describe('areAllShipsSunk', () => {
    test('should return true for board with no ships', () => {
      expect(board.areAllShipsSunk()).toBe(true);
    });

    test('should return false when ships are active', () => {
      board.placeShip(0, 0, 2, 'horizontal');
      expect(board.areAllShipsSunk()).toBe(false);
    });

    test('should return true when all ships are sunk', () => {
      board.placeShip(0, 0, 2, 'horizontal');
      board.processGuess('00');
      board.processGuess('01');
      expect(board.areAllShipsSunk()).toBe(true);
    });
  });

  describe('getDisplayGrid', () => {
    test('should return copy of grid', () => {
      const displayGrid = board.getDisplayGrid();
      expect(displayGrid).toEqual(board.grid);
      
      // Verify it's a copy, not reference
      displayGrid[0][0] = 'X';
      expect(board.grid[0][0]).toBe('~');
    });
  });
}); 
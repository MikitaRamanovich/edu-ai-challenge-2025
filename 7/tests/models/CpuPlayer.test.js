import { CpuPlayer } from '../../src/models/CpuPlayer.js';
import { Board } from '../../src/models/Board.js';

describe('CpuPlayer', () => {
  let cpu;
  let mockOpponentBoard;

  beforeEach(() => {
    cpu = new CpuPlayer('TestCPU', 5);
    mockOpponentBoard = new Board(5);
    mockOpponentBoard.placeShip(0, 0, 2, 'horizontal');
  });

  describe('constructor', () => {
    test('should create CPU player with default name', () => {
      const defaultCpu = new CpuPlayer();
      expect(defaultCpu.name).toBe('CPU');
    });

    test('should initialize in hunt mode', () => {
      expect(cpu.mode).toBe('hunt');
      expect(cpu.targetQueue).toEqual([]);
      expect(cpu.lastHit).toBeNull();
    });
  });

  describe('generateRandomGuess', () => {
    test('should generate valid location', () => {
      const guess = cpu.generateRandomGuess();
      expect(guess).toMatch(/^[0-4][0-4]$/);
      expect(cpu.guesses.has(guess)).toBe(false);
    });

    test('should not generate already guessed location', () => {
      // Fill almost all locations
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (i !== 4 || j !== 4) {
            cpu.guesses.add(`${i}${j}`);
          }
        }
      }
      
      const guess = cpu.generateRandomGuess();
      expect(guess).toBe('44');
    });

    test('should throw error when no locations available', () => {
      // Fill all locations
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          cpu.guesses.add(`${i}${j}`);
        }
      }
      
      expect(() => cpu.generateRandomGuess()).toThrow('No available locations to guess');
    });
  });

  describe('getAdjacentLocations', () => {
    test('should return valid adjacent locations for center position', () => {
      const adjacent = cpu.getAdjacentLocations('22');
      expect(adjacent).toEqual(expect.arrayContaining(['12', '32', '21', '23']));
      expect(adjacent).toHaveLength(4);
    });

    test('should return valid adjacent locations for corner position', () => {
      const adjacent = cpu.getAdjacentLocations('00');
      expect(adjacent).toEqual(expect.arrayContaining(['10', '01']));
      expect(adjacent).toHaveLength(2);
    });

    test('should return valid adjacent locations for edge position', () => {
      const adjacent = cpu.getAdjacentLocations('04');
      expect(adjacent).toEqual(expect.arrayContaining(['14', '03']));
      expect(adjacent).toHaveLength(2);
    });

    test('should exclude already guessed locations', () => {
      cpu.guesses.add('12');
      cpu.guesses.add('32');
      const adjacent = cpu.getAdjacentLocations('22');
      expect(adjacent).toEqual(expect.arrayContaining(['21', '23']));
      expect(adjacent).toHaveLength(2);
    });
  });

  describe('addTargetsToQueue', () => {
    test('should add adjacent locations to target queue', () => {
      cpu.addTargetsToQueue('22');
      expect(cpu.targetQueue).toEqual(expect.arrayContaining(['12', '32', '21', '23']));
    });

    test('should not add duplicate locations to queue', () => {
      cpu.targetQueue.push('12');
      cpu.addTargetsToQueue('22');
      expect(cpu.targetQueue.filter(loc => loc === '12')).toHaveLength(1);
    });
  });

  describe('makeSmartGuess', () => {
    test('should make random guess in hunt mode', () => {
      const { location, result } = cpu.makeSmartGuess(mockOpponentBoard);
      expect(location).toMatch(/^[0-4][0-4]$/);
      expect(cpu.guesses.has(location)).toBe(true);
    });

    test('should switch to target mode on hit', () => {
      const { location, result } = cpu.makeSmartGuess(mockOpponentBoard);
      if (result.hit && !result.sunk) {
        expect(cpu.mode).toBe('target');
        expect(cpu.targetQueue.length).toBeGreaterThan(0);
      }
    });

    test('should return to hunt mode when ship is sunk', () => {
      // First hit
      cpu.makeSmartGuess(mockOpponentBoard);
      if (cpu.mode === 'target') {
        // Continue until ship is sunk
        let attempts = 0;
        while (cpu.mode === 'target' && attempts < 10) {
          const { result } = cpu.makeSmartGuess(mockOpponentBoard);
          if (result.sunk) {
            expect(cpu.mode).toBe('hunt');
            expect(cpu.targetQueue).toEqual([]);
            break;
          }
          attempts++;
        }
      }
    });

    test('should use target queue in target mode', () => {
      cpu.mode = 'target';
      cpu.targetQueue = ['12', '13'];
      
      const { location } = cpu.makeSmartGuess(mockOpponentBoard);
      expect(['12', '13']).toContain(location);
      expect(cpu.targetQueue).toHaveLength(1);
    });
  });

  describe('makeGuess', () => {
    test('should make smart guess when no location provided', () => {
      const result = cpu.makeGuess(null, mockOpponentBoard);
      expect(result).toHaveProperty('hit');
      expect(result).toHaveProperty('sunk');
    });

    test('should use provided location for testing', () => {
      const result = cpu.makeGuess('00', mockOpponentBoard);
      expect(result.hit).toBe(true);
      expect(cpu.guesses.has('00')).toBe(true);
    });
  });

  describe('AI behavior integration', () => {
    test('should demonstrate hunt and target behavior', () => {
      // Place a ship that CPU can find
      const testBoard = new Board(5);
      testBoard.placeShip(2, 2, 3, 'horizontal');
      
      let foundShip = false;
      let attempts = 0;
      
      while (!foundShip && attempts < 25) {
        const result = cpu.makeGuess(null, testBoard);
        attempts++;
        
        if (result.hit) {
          foundShip = true;
          expect(cpu.mode).toBe('target');
          expect(cpu.targetQueue.length).toBeGreaterThan(0);
          break;
        }
      }
      
      // If we found the ship, continue until it's sunk
      if (foundShip) {
        while (cpu.mode === 'target' && attempts < 50) {
          const result = cpu.makeGuess(null, testBoard);
          attempts++;
          
          if (result.sunk) {
            expect(cpu.mode).toBe('hunt');
            expect(cpu.targetQueue).toEqual([]);
            break;
          }
        }
      }
    });
  });

  describe('getter methods', () => {
    test('should return last guess location', () => {
      cpu.lastGuess = '12';
      expect(cpu.getLastGuess()).toBe('12');
    });

    test('should return current mode', () => {
      expect(cpu.getCurrentMode()).toBe('hunt');
      cpu.mode = 'target';
      expect(cpu.getCurrentMode()).toBe('target');
    });

    test('should return target queue size', () => {
      expect(cpu.getTargetQueueSize()).toBe(0);
      cpu.targetQueue = ['12', '13'];
      expect(cpu.getTargetQueueSize()).toBe(2);
    });
  });
}); 
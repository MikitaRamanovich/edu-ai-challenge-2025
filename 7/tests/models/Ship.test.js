import { Ship } from '../../src/models/Ship.js';

describe('Ship', () => {
  let ship;
  const testLocations = ['00', '01', '02'];

  beforeEach(() => {
    ship = new Ship(testLocations);
  });

  describe('constructor', () => {
    test('should create ship with correct locations and length', () => {
      expect(ship.locations).toEqual(testLocations);
      expect(ship.length).toBe(3);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('should create ship with default length of 3', () => {
      const defaultShip = new Ship(['00', '01']);
      expect(defaultShip.length).toBe(3);
    });

    test('should create ship with custom length', () => {
      const customShip = new Ship(['00', '01'], 2);
      expect(customShip.length).toBe(2);
      expect(customShip.hits).toEqual([false, false]);
    });

    test('should create immutable copy of locations', () => {
      const originalLocations = ['00', '01', '02'];
      const newShip = new Ship(originalLocations);
      originalLocations.push('03');
      expect(newShip.locations).toEqual(['00', '01', '02']);
    });
  });

  describe('hit', () => {
    test('should register hit on valid location', () => {
      const result = ship.hit('01');
      expect(result).toBe(true);
      expect(ship.hits[1]).toBe(true);
    });

    test('should not register hit on invalid location', () => {
      const result = ship.hit('99');
      expect(result).toBe(false);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test('should not register hit on already hit location', () => {
      ship.hit('01');
      const result = ship.hit('01');
      expect(result).toBe(false);
      expect(ship.hits[1]).toBe(true);
    });

    test('should register multiple hits on different locations', () => {
      ship.hit('00');
      ship.hit('02');
      expect(ship.hits).toEqual([true, false, true]);
    });
  });

  describe('isSunk', () => {
    test('should return false when ship has no hits', () => {
      expect(ship.isSunk()).toBe(false);
    });

    test('should return false when ship has partial hits', () => {
      ship.hit('00');
      ship.hit('01');
      expect(ship.isSunk()).toBe(false);
    });

    test('should return true when all locations are hit', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe('isHit', () => {
    test('should return false for unhit location', () => {
      expect(ship.isHit('00')).toBe(false);
    });

    test('should return true for hit location', () => {
      ship.hit('00');
      expect(ship.isHit('00')).toBe(true);
    });

    test('should return false for invalid location', () => {
      expect(ship.isHit('99')).toBe(false);
    });
  });

  describe('hasLocation', () => {
    test('should return true for valid ship location', () => {
      expect(ship.hasLocation('01')).toBe(true);
    });

    test('should return false for invalid location', () => {
      expect(ship.hasLocation('99')).toBe(false);
    });
  });

  describe('getHitCount', () => {
    test('should return 0 for new ship', () => {
      expect(ship.getHitCount()).toBe(0);
    });

    test('should return correct count after hits', () => {
      ship.hit('00');
      ship.hit('02');
      expect(ship.getHitCount()).toBe(2);
    });

    test('should return total hits when all locations hit', () => {
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      expect(ship.getHitCount()).toBe(3);
    });
  });
}); 
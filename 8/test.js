/**
 * Comprehensive Test Suite for Validation Library
 * Tests all core functionality with valid and invalid data scenarios
 */

const { 
  Schema, 
  Validator, 
  StringValidator, 
  NumberValidator, 
  BooleanValidator, 
  DateValidator, 
  ArrayValidator, 
  ObjectValidator 
} = require('./schema.js');

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.totalAssertions = 0;
  }

  describe(name, testFn) {
    console.log(`\n=== ${name} ===`);
    testFn();
  }

  it(description, testFn) {
    try {
      testFn();
      console.log(`✓ ${description}`);
      this.passed++;
    } catch (error) {
      console.log(`✗ ${description}`);
      console.log(`  Error: ${error.message}`);
      this.failed++;
    }
  }

  assert(condition, message) {
    this.totalAssertions++;
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    this.totalAssertions++;
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  assertDeepEqual(actual, expected, message) {
    this.totalAssertions++;
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  assertTrue(condition, message) {
    this.assert(condition === true, message || 'Expected true');
  }

  assertFalse(condition, message) {
    this.assert(condition === false, message || 'Expected false');
  }

  run() {
    console.log(`\n=== Test Results ===`);
    console.log(`Tests passed: ${this.passed}`);
    console.log(`Tests failed: ${this.failed}`);
    console.log(`Total assertions: ${this.totalAssertions}`);
    console.log(`Success rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    
    if (this.failed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('❌ Some tests failed');
      process.exit(1);
    }
  }
}

const test = new TestRunner();

// Test String Validator
test.describe('StringValidator', () => {
  test.it('should validate valid strings', () => {
    const validator = Schema.string();
    const result = validator.validate('hello world');
    test.assertTrue(result.isValid);
    test.assertEqual(result.value, 'hello world');
  });

  test.it('should reject non-string values', () => {
    const validator = Schema.string();
    const result = validator.validate(123);
    test.assertFalse(result.isValid);
    test.assertEqual(result.error, 'Value must be a string');
  });

  test.it('should handle optional strings', () => {
    const validator = Schema.string().optional();
    const result1 = validator.validate(undefined);
    test.assertTrue(result1.isValid);
    
    const result2 = validator.validate(null);
    test.assertTrue(result2.isValid);
  });

  test.it('should validate minimum length', () => {
    const validator = Schema.string().minLength(5);
    const result1 = validator.validate('hello');
    test.assertTrue(result1.isValid);
    
    const result2 = validator.validate('hi');
    test.assertFalse(result2.isValid);
    test.assert(result2.error.includes('at least 5'));
  });

  test.it('should validate maximum length', () => {
    const validator = Schema.string().maxLength(5);
    const result1 = validator.validate('hello');
    test.assertTrue(result1.isValid);
    
    const result2 = validator.validate('hello world');
    test.assertFalse(result2.isValid);
    test.assert(result2.error.includes('at most 5'));
  });

  test.it('should validate regex patterns', () => {
    const validator = Schema.string().pattern(/^[a-z]+$/);
    const result1 = validator.validate('hello');
    test.assertTrue(result1.isValid);
    
    const result2 = validator.validate('Hello123');
    test.assertFalse(result2.isValid);
    test.assert(result2.error.includes('does not match'));
  });

  test.it('should use custom error messages', () => {
    const validator = Schema.string().withMessage('Custom error message');
    const result = validator.validate(123);
    test.assertFalse(result.isValid);
    test.assertEqual(result.error, 'Custom error message');
  });
});

// Test Number Validator
test.describe('NumberValidator', () => {
  test.it('should validate valid numbers', () => {
    const validator = Schema.number();
    const result = validator.validate(42);
    test.assertTrue(result.isValid);
    test.assertEqual(result.value, 42);
  });

  test.it('should reject non-number values', () => {
    const validator = Schema.number();
    const result = validator.validate('not a number');
    test.assertFalse(result.isValid);
    test.assertEqual(result.error, 'Value must be a number');
  });

  test.it('should reject NaN values', () => {
    const validator = Schema.number();
    const result = validator.validate(NaN);
    test.assertFalse(result.isValid);
    test.assertEqual(result.error, 'Value must be a number');
  });

  test.it('should validate minimum values', () => {
    const validator = Schema.number().min(10);
    const result1 = validator.validate(15);
    test.assertTrue(result1.isValid);
    
    const result2 = validator.validate(5);
    test.assertFalse(result2.isValid);
    test.assert(result2.error.includes('at least 10'));
  });

  test.it('should validate maximum values', () => {
    const validator = Schema.number().max(100);
    const result1 = validator.validate(50);
    test.assertTrue(result1.isValid);
    
    const result2 = validator.validate(150);
    test.assertFalse(result2.isValid);
    test.assert(result2.error.includes('at most 100'));
  });

  test.it('should validate integer requirement', () => {
    const validator = Schema.number().integer();
    const result1 = validator.validate(42);
    test.assertTrue(result1.isValid);
    
    const result2 = validator.validate(42.5);
    test.assertFalse(result2.isValid);
    test.assertEqual(result2.error, 'Value must be an integer');
  });
});

// Test Boolean Validator
test.describe('BooleanValidator', () => {
  test.it('should validate true values', () => {
    const validator = Schema.boolean();
    const result = validator.validate(true);
    test.assertTrue(result.isValid);
    test.assertEqual(result.value, true);
  });

  test.it('should validate false values', () => {
    const validator = Schema.boolean();
    const result = validator.validate(false);
    test.assertTrue(result.isValid);
    test.assertEqual(result.value, false);
  });

  test.it('should reject non-boolean values', () => {
    const validator = Schema.boolean();
    const result = validator.validate('true');
    test.assertFalse(result.isValid);
    test.assertEqual(result.error, 'Value must be a boolean');
  });

  test.it('should handle optional booleans', () => {
    const validator = Schema.boolean().optional();
    const result = validator.validate(undefined);
    test.assertTrue(result.isValid);
  });
});

// Test Date Validator
test.describe('DateValidator', () => {
  test.it('should validate Date objects', () => {
    const validator = Schema.date();
    const date = new Date('2023-01-01');
    const result = validator.validate(date);
    test.assertTrue(result.isValid);
    test.assertEqual(result.value.getTime(), date.getTime());
  });

  test.it('should validate date strings', () => {
    const validator = Schema.date();
    const result = validator.validate('2023-01-01');
    test.assertTrue(result.isValid);
    test.assert(result.value instanceof Date);
  });

  test.it('should reject invalid date strings', () => {
    const validator = Schema.date();
    const result = validator.validate('not a date');
    test.assertFalse(result.isValid);
    test.assertEqual(result.error, 'Value must be a valid date');
  });

  test.it('should validate date ranges', () => {
    const minDate = new Date('2023-01-01');
    const maxDate = new Date('2023-12-31');
    const validator = Schema.date().after(minDate).before(maxDate);
    
    const result1 = validator.validate(new Date('2023-06-15'));
    test.assertTrue(result1.isValid);
    
    const result2 = validator.validate(new Date('2022-01-01'));
    test.assertFalse(result2.isValid);
    test.assert(result2.error.includes('after'));
  });
});

// Test Array Validator
test.describe('ArrayValidator', () => {
  test.it('should validate arrays with valid items', () => {
    const validator = Schema.array(Schema.string());
    const result = validator.validate(['hello', 'world']);
    test.assertTrue(result.isValid);
    test.assertDeepEqual(result.value, ['hello', 'world']);
  });

  test.it('should reject non-array values', () => {
    const validator = Schema.array(Schema.string());
    const result = validator.validate('not an array');
    test.assertFalse(result.isValid);
    test.assertEqual(result.error, 'Value must be an array');
  });

  test.it('should validate array items', () => {
    const validator = Schema.array(Schema.number());
    const result = validator.validate([1, 2, 'three']);
    test.assertFalse(result.isValid);
    test.assert(result.error.includes('Item at index 2'));
  });

  test.it('should validate array length constraints', () => {
    const validator = Schema.array(Schema.string()).minLength(2).maxLength(4);
    
    const result1 = validator.validate(['a', 'b', 'c']);
    test.assertTrue(result1.isValid);
    
    const result2 = validator.validate(['a']);
    test.assertFalse(result2.isValid);
    test.assert(result2.error.includes('at least 2'));
    
    const result3 = validator.validate(['a', 'b', 'c', 'd', 'e']);
    test.assertFalse(result3.isValid);
    test.assert(result3.error.includes('at most 4'));
  });

  test.it('should handle optional arrays', () => {
    const validator = Schema.array(Schema.string()).optional();
    const result = validator.validate(undefined);
    test.assertTrue(result.isValid);
  });
});

// Test Object Validator
test.describe('ObjectValidator', () => {
  test.it('should validate objects with valid schema', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number()
    });
    
    const result = validator.validate({ name: 'John', age: 30 });
    test.assertTrue(result.isValid);
    test.assertDeepEqual(result.value, { name: 'John', age: 30 });
  });

  test.it('should reject non-object values', () => {
    const validator = Schema.object({});
    const result = validator.validate('not an object');
    test.assertFalse(result.isValid);
    test.assertEqual(result.error, 'Value must be an object');
  });

  test.it('should reject arrays as objects', () => {
    const validator = Schema.object({});
    const result = validator.validate([]);
    test.assertFalse(result.isValid);
    test.assertEqual(result.error, 'Value must be an object');
  });

  test.it('should validate object properties', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number()
    });
    
    const result = validator.validate({ name: 'John', age: 'thirty' });
    test.assertFalse(result.isValid);
    test.assert(result.error.includes("Property 'age'"));
  });

  test.it('should handle optional properties', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number().optional()
    });
    
    const result = validator.validate({ name: 'John' });
    test.assertTrue(result.isValid);
    test.assertDeepEqual(result.value, { name: 'John' });
  });

  test.it('should reject unknown properties by default', () => {
    const validator = Schema.object({
      name: Schema.string()
    });
    
    const result = validator.validate({ name: 'John', age: 30 });
    test.assertFalse(result.isValid);
    test.assert(result.error.includes('Unknown properties'));
  });

  test.it('should allow unknown properties when configured', () => {
    const validator = Schema.object({
      name: Schema.string()
    }).allowUnknown();
    
    const result = validator.validate({ name: 'John', age: 30 });
    test.assertTrue(result.isValid);
    test.assertDeepEqual(result.value, { name: 'John', age: 30 });
  });
});

// Test Complex Nested Schemas
test.describe('Complex Nested Schemas', () => {
  test.it('should validate nested objects', () => {
    const addressSchema = Schema.object({
      street: Schema.string(),
      city: Schema.string(),
      postalCode: Schema.string().pattern(/^\d{5}$/)
    });
    
    const userSchema = Schema.object({
      name: Schema.string(),
      address: addressSchema
    });
    
    const result = userSchema.validate({
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345'
      }
    });
    
    test.assertTrue(result.isValid);
  });

  test.it('should validate arrays with object items', () => {
    const userSchema = Schema.object({
      name: Schema.string(),
      age: Schema.number().min(0).max(150)
    });
    
    const usersValidator = Schema.array(userSchema);
    
    const result = usersValidator.validate([
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 }
    ]);
    
    test.assertTrue(result.isValid);
    test.assertEqual(result.value.length, 2);
  });

  test.it('should handle deep nesting validation errors', () => {
    const addressSchema = Schema.object({
      postalCode: Schema.string().pattern(/^\d{5}$/)
    });
    
    const userSchema = Schema.object({
      address: addressSchema
    });
    
    const result = userSchema.validate({
      address: {
        postalCode: 'invalid'
      }
    });
    
    test.assertFalse(result.isValid);
    test.assert(result.error.includes("Property 'address'"));
  });
});

// Test Email Validation Example
test.describe('Real-world Email Validation', () => {
  test.it('should validate email addresses', () => {
    const emailValidator = Schema.string()
      .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .withMessage('Invalid email format');
    
    const result1 = emailValidator.validate('user@example.com');
    test.assertTrue(result1.isValid);
    
    const result2 = emailValidator.validate('invalid-email');
    test.assertFalse(result2.isValid);
    test.assertEqual(result2.error, 'Invalid email format');
  });
});

// Test User Profile Schema
test.describe('Complete User Profile Validation', () => {
  test.it('should validate complete user profiles', () => {
    const addressSchema = Schema.object({
      street: Schema.string(),
      city: Schema.string(),
      postalCode: Schema.string().pattern(/^\d{5}$/).withMessage('Postal code must be 5 digits'),
      country: Schema.string()
    });

    const userSchema = Schema.object({
      id: Schema.string(),
      name: Schema.string().minLength(2).maxLength(50),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      age: Schema.number().min(0).max(150).optional(),
      isActive: Schema.boolean(),
      tags: Schema.array(Schema.string()).minLength(1),
      address: addressSchema.optional(),
      createdAt: Schema.date()
    });

    const validUser = {
      id: "user123",
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      isActive: true,
      tags: ["developer", "designer"],
      address: {
        street: "123 Main St",
        city: "Anytown",
        postalCode: "12345",
        country: "USA"
      },
      createdAt: new Date()
    };

    const result = userSchema.validate(validUser);
    test.assertTrue(result.isValid);
  });
});

// Test Error Handling
test.describe('Error Handling', () => {
  test.it('should throw error for unimplemented validate method', () => {
    const baseValidator = new Validator();
    try {
      baseValidator.validate('test');
      test.assert(false, 'Should have thrown an error');
    } catch (error) {
      test.assert(error.message.includes('validate method must be implemented'));
    }
  });

  test.it('should handle null and undefined consistently', () => {
    const validator = Schema.string();
    
    const result1 = validator.validate(null);
    test.assertFalse(result1.isValid);
    test.assertEqual(result1.error, 'Value is required');
    
    const result2 = validator.validate(undefined);
    test.assertFalse(result2.isValid);
    test.assertEqual(result2.error, 'Value is required');
  });
});

// Run all tests
test.run();

// Export test results for coverage calculation
module.exports = {
  totalTests: test.passed + test.failed,
  passedTests: test.passed,
  failedTests: test.failed,
  totalAssertions: test.totalAssertions,
  coveragePercentage: ((test.passed / (test.passed + test.failed)) * 100)
}; 
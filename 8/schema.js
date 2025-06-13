/**
 * Robust Data Validation Library
 * Provides type-safe validation for primitive and complex data types
 */

/**
 * Base validator class that all specific validators extend
 */
class Validator {
  constructor() {
    this.isOptionalValue = false;
    this.customMessage = null;
  }

  /**
   * Marks this validator as optional
   * @returns {Validator} Returns this validator for chaining
   */
  optional() {
    this.isOptionalValue = true;
    return this;
  }

  /**
   * Sets a custom error message for validation failures
   * @param {string} message - The custom error message
   * @returns {Validator} Returns this validator for chaining
   */
  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  /**
   * Creates a validation error object
   * @param {string} message - The error message
   * @param {*} value - The value that failed validation
   * @returns {Object} Validation error object
   */
  createError(message, value) {
    return {
      isValid: false,
      error: this.customMessage || message,
      value: value
    };
  }

  /**
   * Creates a successful validation result
   * @param {*} value - The validated value
   * @returns {Object} Successful validation result
   */
  createSuccess(value) {
    return {
      isValid: true,
      value: value
    };
  }

  /**
   * Abstract method to be implemented by specific validators
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    throw new Error('validate method must be implemented by subclass');
  }
}

/**
 * String validator with various string-specific validation rules
 */
class StringValidator extends Validator {
  constructor() {
    super();
    this.minLengthValue = null;
    this.maxLengthValue = null;
    this.patternRegex = null;
  }

  /**
   * Sets minimum length requirement for the string
   * @param {number} length - Minimum required length
   * @returns {StringValidator} Returns this validator for chaining
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Sets maximum length requirement for the string
   * @param {number} length - Maximum allowed length
   * @returns {StringValidator} Returns this validator for chaining
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  /**
   * Sets a regex pattern the string must match
   * @param {RegExp} regex - Regular expression pattern
   * @returns {StringValidator} Returns this validator for chaining
   */
  pattern(regex) {
    this.patternRegex = regex;
    return this;
  }

  /**
   * Validates a value as a string with all configured rules
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptionalValue) {
        return this.createSuccess(value);
      }
      return this.createError('Value is required', value);
    }

    // Check if value is a string
    if (typeof value !== 'string') {
      return this.createError('Value must be a string', value);
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      return this.createError(`String must be at least ${this.minLengthValue} characters long`, value);
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      return this.createError(`String must be at most ${this.maxLengthValue} characters long`, value);
    }

    // Check pattern
    if (this.patternRegex && !this.patternRegex.test(value)) {
      return this.createError('String does not match required pattern', value);
    }

    return this.createSuccess(value);
  }
}

/**
 * Number validator with numeric-specific validation rules
 */
class NumberValidator extends Validator {
  constructor() {
    super();
    this.minValue = null;
    this.maxValue = null;
    this.isIntegerOnly = false;
  }

  /**
   * Sets minimum value requirement
   * @param {number} min - Minimum allowed value
   * @returns {NumberValidator} Returns this validator for chaining
   */
  min(min) {
    this.minValue = min;
    return this;
  }

  /**
   * Sets maximum value requirement
   * @param {number} max - Maximum allowed value
   * @returns {NumberValidator} Returns this validator for chaining
   */
  max(max) {
    this.maxValue = max;
    return this;
  }

  /**
   * Requires the number to be an integer
   * @returns {NumberValidator} Returns this validator for chaining
   */
  integer() {
    this.isIntegerOnly = true;
    return this;
  }

  /**
   * Validates a value as a number with all configured rules
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptionalValue) {
        return this.createSuccess(value);
      }
      return this.createError('Value is required', value);
    }

    // Check if value is a number
    if (typeof value !== 'number' || isNaN(value)) {
      return this.createError('Value must be a number', value);
    }

    // Check if integer is required
    if (this.isIntegerOnly && !Number.isInteger(value)) {
      return this.createError('Value must be an integer', value);
    }

    // Check minimum value
    if (this.minValue !== null && value < this.minValue) {
      return this.createError(`Value must be at least ${this.minValue}`, value);
    }

    // Check maximum value
    if (this.maxValue !== null && value > this.maxValue) {
      return this.createError(`Value must be at most ${this.maxValue}`, value);
    }

    return this.createSuccess(value);
  }
}

/**
 * Boolean validator for boolean values
 */
class BooleanValidator extends Validator {
  /**
   * Validates a value as a boolean
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptionalValue) {
        return this.createSuccess(value);
      }
      return this.createError('Value is required', value);
    }

    // Check if value is a boolean
    if (typeof value !== 'boolean') {
      return this.createError('Value must be a boolean', value);
    }

    return this.createSuccess(value);
  }
}

/**
 * Date validator for Date objects and date strings
 */
class DateValidator extends Validator {
  constructor() {
    super();
    this.minDate = null;
    this.maxDate = null;
  }

  /**
   * Sets minimum date requirement
   * @param {Date} date - Minimum allowed date
   * @returns {DateValidator} Returns this validator for chaining
   */
  after(date) {
    this.minDate = date;
    return this;
  }

  /**
   * Sets maximum date requirement
   * @param {Date} date - Maximum allowed date
   * @returns {DateValidator} Returns this validator for chaining
   */
  before(date) {
    this.maxDate = date;
    return this;
  }

  /**
   * Validates a value as a date
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptionalValue) {
        return this.createSuccess(value);
      }
      return this.createError('Value is required', value);
    }

    // Convert to Date if it's a string
    let dateValue;
    if (typeof value === 'string') {
      dateValue = new Date(value);
    } else if (value instanceof Date) {
      dateValue = value;
    } else {
      return this.createError('Value must be a Date object or date string', value);
    }

    // Check if date is valid
    if (isNaN(dateValue.getTime())) {
      return this.createError('Value must be a valid date', value);
    }

    // Check minimum date
    if (this.minDate && dateValue < this.minDate) {
      return this.createError(`Date must be after ${this.minDate.toISOString()}`, value);
    }

    // Check maximum date
    if (this.maxDate && dateValue > this.maxDate) {
      return this.createError(`Date must be before ${this.maxDate.toISOString()}`, value);
    }

    return this.createSuccess(dateValue);
  }
}

/**
 * Array validator for validating arrays and their elements
 */
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this.minLengthValue = null;
    this.maxLengthValue = null;
  }

  /**
   * Sets minimum array length requirement
   * @param {number} length - Minimum required array length
   * @returns {ArrayValidator} Returns this validator for chaining
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Sets maximum array length requirement
   * @param {number} length - Maximum allowed array length
   * @returns {ArrayValidator} Returns this validator for chaining
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  /**
   * Validates a value as an array with element validation
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptionalValue) {
        return this.createSuccess(value);
      }
      return this.createError('Value is required', value);
    }

    // Check if value is an array
    if (!Array.isArray(value)) {
      return this.createError('Value must be an array', value);
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      return this.createError(`Array must have at least ${this.minLengthValue} items`, value);
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      return this.createError(`Array must have at most ${this.maxLengthValue} items`, value);
    }

    // Validate each item in the array
    const validatedItems = [];
    for (let i = 0; i < value.length; i++) {
      const itemResult = this.itemValidator.validate(value[i]);
      if (!itemResult.isValid) {
        return this.createError(`Item at index ${i}: ${itemResult.error}`, value);
      }
      validatedItems.push(itemResult.value);
    }

    return this.createSuccess(validatedItems);
  }
}

/**
 * Object validator for validating objects with schema-based validation
 */
class ObjectValidator extends Validator {
  constructor(schema) {
    super();
    this.schema = schema;
    this.allowUnknownKeys = false;
  }

  /**
   * Allows unknown keys in the object (keys not defined in schema)
   * @returns {ObjectValidator} Returns this validator for chaining
   */
  allowUnknown() {
    this.allowUnknownKeys = true;
    return this;
  }

  /**
   * Validates a value as an object with schema validation
   * @param {*} value - Value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptionalValue) {
        return this.createSuccess(value);
      }
      return this.createError('Value is required', value);
    }

    // Check if value is an object
    if (typeof value !== 'object' || Array.isArray(value)) {
      return this.createError('Value must be an object', value);
    }

    const validatedObject = {};
    const valueKeys = Object.keys(value);
    const schemaKeys = Object.keys(this.schema);

    // Validate each property defined in schema
    for (const key of schemaKeys) {
      const validator = this.schema[key];
      const propResult = validator.validate(value[key]);
      
      if (!propResult.isValid) {
        return this.createError(`Property '${key}': ${propResult.error}`, value);
      }
      
      // Only include non-undefined values in the result
      if (propResult.value !== undefined) {
        validatedObject[key] = propResult.value;
      }
    }

    // Check for unknown keys if not allowed
    if (!this.allowUnknownKeys) {
      const unknownKeys = valueKeys.filter(key => !schemaKeys.includes(key));
      if (unknownKeys.length > 0) {
        return this.createError(`Unknown properties: ${unknownKeys.join(', ')}`, value);
      }
    } else {
      // Include unknown keys in the result if allowed
      for (const key of valueKeys) {
        if (!schemaKeys.includes(key)) {
          validatedObject[key] = value[key];
        }
      }
    }

    return this.createSuccess(validatedObject);
  }
}

/**
 * Main Schema builder class providing static factory methods for validators
 */
class Schema {
  /**
   * Creates a string validator
   * @returns {StringValidator} New string validator instance
   */
  static string() {
    return new StringValidator();
  }
  
  /**
   * Creates a number validator
   * @returns {NumberValidator} New number validator instance
   */
  static number() {
    return new NumberValidator();
  }
  
  /**
   * Creates a boolean validator
   * @returns {BooleanValidator} New boolean validator instance
   */
  static boolean() {
    return new BooleanValidator();
  }
  
  /**
   * Creates a date validator
   * @returns {DateValidator} New date validator instance
   */
  static date() {
    return new DateValidator();
  }
  
  /**
   * Creates an object validator with a given schema
   * @param {Object} schema - Object mapping property names to validators
   * @returns {ObjectValidator} New object validator instance
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }
  
  /**
   * Creates an array validator with item validation
   * @param {Validator} itemValidator - Validator for array items
   * @returns {ArrayValidator} New array validator instance
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Schema,
    Validator,
    StringValidator,
    NumberValidator,
    BooleanValidator,
    DateValidator,
    ArrayValidator,
    ObjectValidator
  };
}

// Example usage demonstration
if (typeof window === 'undefined' && require.main === module) {
  // Define a complex schema for demonstration
  const addressSchema = Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/).withMessage('Postal code must be 5 digits'),
    country: Schema.string()
  });

  const userSchema = Schema.object({
    id: Schema.string().withMessage('ID must be a string'),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    age: Schema.number().optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()),
    address: addressSchema.optional(),
    metadata: Schema.object({}).optional().allowUnknown()
  });

  // Test data
  const userData = {
    id: "12345",
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    tags: ["developer", "designer"],
    address: {
      street: "123 Main St",
      city: "Anytown",
      postalCode: "12345",
      country: "USA"
    }
  };

  console.log('Validation Result:', userSchema.validate(userData));
}
  
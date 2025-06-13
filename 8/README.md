# Robust Data Validation Library

A comprehensive, type-safe JavaScript validation library for validating primitive and complex data structures with fluent API design.

## Features

- ✅ **Type-safe validation** for primitive types (string, number, boolean, date)
- ✅ **Complex type support** for arrays and objects
- ✅ **Fluent API design** with method chaining
- ✅ **Custom error messages** for better user experience
- ✅ **Optional field support** for flexible validation
- ✅ **Nested object validation** with schema composition
- ✅ **Array validation** with item-level validation
- ✅ **Regular expression patterns** for string validation
- ✅ **Comprehensive test coverage** (40+ test cases)

## Installation

Since this is a standalone library, simply include the `schema.js` file in your project:

```javascript
// For Node.js
const { Schema } = require('./schema.js');

// For browser (include schema.js script tag)
// Schema is available globally
```

## Quick Start

```javascript
const { Schema } = require('./schema.js');

// Simple string validation
const nameValidator = Schema.string().minLength(2).maxLength(50);
const result = nameValidator.validate("John Doe");

if (result.isValid) {
    console.log("Valid name:", result.value);
} else {
    console.log("Error:", result.error);
}
```

## API Reference

### Basic Validators

#### String Validator

```javascript
const stringValidator = Schema.string()
    .minLength(5)           // Minimum length
    .maxLength(100)         // Maximum length
    .pattern(/^[a-zA-Z]+$/) // Regex pattern
    .optional()             // Make field optional
    .withMessage('Custom error message');

// Example usage
const emailValidator = Schema.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage('Please enter a valid email address');
```

#### Number Validator

```javascript
const numberValidator = Schema.number()
    .min(0)          // Minimum value
    .max(100)        // Maximum value
    .integer()       // Must be an integer
    .optional();     // Make field optional

// Example usage
const ageValidator = Schema.number()
    .min(0)
    .max(150)
    .integer()
    .withMessage('Age must be a valid integer between 0 and 150');
```

#### Boolean Validator

```javascript
const booleanValidator = Schema.boolean()
    .optional()
    .withMessage('Value must be true or false');
```

#### Date Validator

```javascript
const dateValidator = Schema.date()
    .after(new Date('2020-01-01'))  // Must be after this date
    .before(new Date('2030-01-01')) // Must be before this date
    .optional();

// Example usage
const birthDateValidator = Schema.date()
    .before(new Date())
    .withMessage('Birth date cannot be in the future');
```

### Complex Validators

#### Array Validator

```javascript
const arrayValidator = Schema.array(Schema.string())
    .minLength(1)    // Minimum array length
    .maxLength(10)   // Maximum array length
    .optional();

// Example usage
const tagsValidator = Schema.array(Schema.string())
    .minLength(1)
    .withMessage('At least one tag is required');

// Nested array validation
const userListValidator = Schema.array(
    Schema.object({
        name: Schema.string(),
        age: Schema.number()
    })
);
```

#### Object Validator

```javascript
const objectValidator = Schema.object({
    name: Schema.string(),
    age: Schema.number()
})
.allowUnknown()  // Allow properties not in schema
.optional();

// Example usage
const userValidator = Schema.object({
    id: Schema.string(),
    name: Schema.string().minLength(2),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    age: Schema.number().min(0).optional(),
    isActive: Schema.boolean()
});
```

## Usage Examples

### Basic Validation

```javascript
const { Schema } = require('./schema.js');

// Validate a simple string
const nameResult = Schema.string().minLength(2).validate("John");
console.log(nameResult); // { isValid: true, value: "John" }

// Validate with error
const ageResult = Schema.number().min(0).validate(-5);
console.log(ageResult); // { isValid: false, error: "Value must be at least 0", value: -5 }
```

### Complex Object Validation

```javascript
// Define a user schema
const userSchema = Schema.object({
    id: Schema.string(),
    profile: Schema.object({
        firstName: Schema.string().minLength(1),
        lastName: Schema.string().minLength(1),
        email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        age: Schema.number().min(0).max(150).optional()
    }),
    tags: Schema.array(Schema.string()).minLength(1),
    isActive: Schema.boolean(),
    createdAt: Schema.date()
});

// Test data
const userData = {
    id: "user123",
    profile: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        age: 30
    },
    tags: ["developer", "javascript"],
    isActive: true,
    createdAt: new Date()
};

const result = userSchema.validate(userData);
if (result.isValid) {
    console.log("User data is valid!");
} else {
    console.log("Validation error:", result.error);
}
```

### Real-world Examples

#### User Registration Form

```javascript
const registrationSchema = Schema.object({
    username: Schema.string()
        .minLength(3)
        .maxLength(20)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username must be 3-20 characters, letters, numbers, and underscores only'),
    
    email: Schema.string()
        .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        .withMessage('Please enter a valid email address'),
    
    password: Schema.string()
        .minLength(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must be at least 8 characters with uppercase, lowercase, and number'),
    
    age: Schema.number()
        .min(13)
        .max(120)
        .optional()
        .withMessage('Age must be between 13 and 120'),
    
    interests: Schema.array(Schema.string())
        .minLength(1)
        .maxLength(5)
        .withMessage('Please select 1-5 interests'),
    
    agreeToTerms: Schema.boolean()
        .withMessage('You must agree to the terms of service')
});
```

#### API Response Validation

```javascript
const apiResponseSchema = Schema.object({
    success: Schema.boolean(),
    data: Schema.object({
        users: Schema.array(Schema.object({
            id: Schema.string(),
            name: Schema.string(),
            email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
            role: Schema.string(),
            lastLogin: Schema.date().optional()
        })),
        pagination: Schema.object({
            page: Schema.number().min(1),
            limit: Schema.number().min(1).max(100),
            total: Schema.number().min(0)
        })
    }),
    message: Schema.string().optional()
});
```

## Error Handling

The validation library returns a consistent error format:

```javascript
// Successful validation
{
    isValid: true,
    value: validatedValue
}

// Failed validation
{
    isValid: false,
    error: "Descriptive error message",
    value: originalValue
}
```

### Custom Error Messages

```javascript
const validator = Schema.string()
    .minLength(5)
    .withMessage('This field must be at least 5 characters long');

const result = validator.validate('hi');
console.log(result.error); // "This field must be at least 5 characters long"
```

## Running Tests

Run the comprehensive test suite:

```bash
node test.js
```

The test suite includes:
- ✅ 40+ test cases covering all functionality
- ✅ Valid and invalid data scenarios
- ✅ Edge cases and error conditions
- ✅ Complex nested validation scenarios
- ✅ Real-world usage examples

## Test Coverage

Our test suite achieves comprehensive coverage:
- **String Validation**: Length constraints, patterns, optional fields
- **Number Validation**: Min/max values, integer validation, edge cases
- **Boolean Validation**: True/false values, type checking
- **Date Validation**: Date objects, string parsing, range validation
- **Array Validation**: Item validation, length constraints, nested arrays
- **Object Validation**: Schema validation, optional properties, nested objects
- **Complex Scenarios**: Deep nesting, composition, real-world examples

## Best Practices

### 1. Schema Composition
Build complex schemas by composing simpler ones:

```javascript
const addressSchema = Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    zipCode: Schema.string().pattern(/^\d{5}$/)
});

const userSchema = Schema.object({
    name: Schema.string(),
    address: addressSchema,
    billingAddress: addressSchema.optional()
});
```

### 2. Reusable Validators
Create reusable validators for common patterns:

```javascript
const emailValidator = Schema.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage('Please enter a valid email address');

const phoneValidator = Schema.string()
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .withMessage('Phone must be in format (123) 456-7890');
```

### 3. Error Handling Strategy
Always check validation results before proceeding:

```javascript
function processUser(userData) {
    const result = userSchema.validate(userData);
    
    if (!result.isValid) {
        throw new Error(`Invalid user data: ${result.error}`);
    }
    
    // Proceed with validated data
    return result.value;
}
```

## Performance Considerations

- **Lazy Validation**: Validation stops at the first error
- **Memory Efficient**: No heavy dependencies, minimal memory footprint
- **Fast Execution**: Optimized validation logic with early returns
- **Caching**: Reuse validator instances for better performance

## Browser Compatibility

This library works in all modern browsers and Node.js environments:
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Node.js 12+

## Contributing

This library is designed to be lightweight and focused. When contributing:

1. **Maintain simplicity**: Keep the API intuitive and easy to use
2. **Add comprehensive tests**: All new features must have test coverage
3. **Document thoroughly**: Update README.md with usage examples
4. **Follow conventions**: Use consistent naming and error messages

## License

MIT License - feel free to use this library in your projects.

## Support

For questions or issues, please review the examples in this README or examine the test cases in `test.js` for comprehensive usage patterns.

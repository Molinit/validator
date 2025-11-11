# Validator

A flexible, type-safe validation library for TypeScript/JavaScript that provides declarative schema-based validation with support for complex data structures, conditional requirements, and custom validators.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Validation Rules](#validation-rules)
- [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [TypeScript Support](#typescript-support)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Validator is designed to validate complex nested data structures using a declarative schema approach. Instead of writing imperative validation code, you define a schema that describes your data requirements, and the validator handles the rest.

### Key Benefits

- **Declarative:** Define validation rules as data structures
- **Type-safe:** Full TypeScript support with strict typing
- **Composable:** Build complex validations from simple rules
- **Extensible:** Add custom validation functions
- **Conditional:** Support for dependent field validation
- **Comprehensive:** Validates primitives, objects, arrays, and nested structures

---

## Features

- ✅ **Primitive validation:** strings, numbers, booleans
- ✅ **Pattern matching:** regex validation
- ✅ **Length constraints:** min/max length validation
- ✅ **Enum validation:** one-of allowed values
- ✅ **Array validation:** validate arrays and their items
- ✅ **Object shape validation:** validate object structures with type checking
- ✅ **Array of objects:** validate arrays of structured objects
- ✅ **Conditional validation:** fields required based on other fields
- ✅ **Custom validators:** add your own validation logic
- ✅ **Comprehensive error messages:** clear, actionable error reporting

---

## Installation

```bash
npm install @molinit/validator
```

Or with yarn:

```bash
yarn add @molinit/validator
```

---

## Quick Start

```typescript
import validate from '@molinit/validator';
import { ValidationDescription } from '@molinit/validator/types';

// Define your validation schema
const userSchema: ValidationDescription = {
  email: {
    required: true,
    regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  age: {
    required: true,
    minLength: 1,
    maxLength: 3,
  },
  role: {
    required: true,
    oneof: ['admin', 'user', 'guest'],
  },
};

// Validate data
const userData = {
  email: 'user@example.com',
  age: '25',
  role: 'user',
};

const errors = validate(userData, userSchema);

if (errors.length > 0) {
  console.error('Validation failed:', errors);
  // [{ field: 'email', message: 'Missing required field' }]
} else {
  console.log('Validation passed!');
}
```

---

## Core Concepts

### Validation Schema

A validation schema is a plain JavaScript object that describes the validation rules for your data:

```typescript
const schema: ValidationDescription = {
  fieldName: {
    // Validation rules go here
    required: true,
    minLength: 5,
    maxLength: 100,
  },
};
```

### Validation Rules

Each field in your schema can have multiple validation rules. All rules for a field must pass for the data to be valid.

### Error Format

Validation errors are returned as an array of objects:

```typescript
type ValidationError = {
  field: string;      // The field that failed validation
  message: string;    // Human-readable error message
};
```

---

## Validation Rules

### `required`

Ensures a field is present and not empty.

```typescript
{
  username: {
    required: true,
  }
}
```

**Validates:**
- Field exists
- Value is not `undefined`, `null`, or empty string
- For arrays: at least one item exists (when used with `array: true`)

---

### `required_depends_on`

Makes a field required only when another field has a specific value.

```typescript
{
  password_confirmation: {
    required_depends_on: { key: 'change_password', value: '1' },
  }
}
```

**Example:**
```typescript
// Valid: change_password is '0', so confirmation not required
{ change_password: '0', password_confirmation: '' }

// Invalid: change_password is '1', so confirmation is required
{ change_password: '1', password_confirmation: '' }
```

---

### `minLength` / `maxLength`

Validates the length of a string or the string representation of a value.

```typescript
{
  username: {
    minLength: 3,
    maxLength: 20,
  }
}
```

**Example:**
```typescript
{ username: 'ab' }        // Invalid: too short
{ username: 'alice' }     // Valid
{ username: 'a'.repeat(21) } // Invalid: too long
```

---

### `regexp`

Validates a field against a regular expression.

```typescript
{
  email: {
    regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  zipCode: {
    regexp: /^\d{5}(-\d{4})?$/,
  }
}
```

**Example:**
```typescript
{ email: 'user@example.com' }  // Valid
{ email: 'invalid-email' }     // Invalid
```

---

### `equal`

Validates that a field equals a specific value.

```typescript
{
  confirmation: {
    equal: 'I agree to the terms',
  }
}
```

---

### `oneof`

Validates that a field is one of the allowed values (enum validation).

```typescript
{
  status: {
    oneof: ['draft', 'published', 'archived'],
  },
  country: {
    oneof: ['US', 'CA', 'MX', 'UK', 'FR', 'DE'],
  }
}
```

**Example:**
```typescript
{ status: 'published' }  // Valid
{ status: 'pending' }    // Invalid
```

---

### `array`

Validates that a field is an array.

```typescript
{
  tags: {
    required: true,
    array: true,  // Must be an array with at least one item
  }
}
```

**Example:**
```typescript
{ tags: ['javascript', 'typescript'] }  // Valid
{ tags: [] }                            // Invalid: empty array with required: true
{ tags: 'string' }                      // Invalid: not an array
```

---

### `array_items`

Validates that all items in an array are from an allowed list.

```typescript
{
  tags: {
    array: true,
    array_items: ['javascript', 'typescript', 'python', 'rust'],
  }
}
```

**Example:**
```typescript
{ tags: ['javascript', 'typescript'] }  // Valid
{ tags: ['javascript', 'php'] }         // Invalid: 'php' not in allowed list
```

**Supports:**
- Primitives (strings, numbers, booleans)
- Objects (deep comparison via JSON)

---

### `shapeOf`

Validates that a field is an object matching a specific shape with optional custom validators.

```typescript
{
  address: {
    shapeOf: {
      shape: {
        street: 'string',
        city: 'string',
        zipCode: 'string',
        country: ['US', 'CA', 'MX'],  // Enum validation
      },
      required: ['street', 'city', 'country'],
      validators: {
        zipCode: (value) => /^\d{5}$/.test(value as string),
      },
    },
  }
}
```

**Features:**
- **Type checking:** Validates each property type
- **Required properties:** Specify which properties are mandatory
- **Enum values:** Use array for allowed values
- **Custom validators:** Add property-specific validation functions

**Example:**
```typescript
// Valid
{
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001',
    country: 'US',
  }
}

// Invalid: missing required 'city'
{
  address: {
    street: '123 Main St',
    country: 'US',
  }
}

// Invalid: wrong type for 'zipCode'
{
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: 12345,  // Should be string
    country: 'US',
  }
}
```

---

### `arrayOfShapes`

Validates an array of objects, each matching a specific shape.

```typescript
{
  items: {
    arrayOfShapes: {
      shape: {
        name: 'string',
        quantity: 'number',
        price: 'number',
        category: ['electronics', 'clothing', 'food'],
      },
      required: ['name', 'quantity', 'price'],
      validators: {
        _array: (arr) => arr.length <= 100,  // Array-level validator
        price: (price) => price > 0,         // Property-level validator
        quantity: (qty) => qty > 0 && qty <= 1000,
      },
    },
  }
}
```

**Features:**
- **Array-level validation:** `_array` validator for the entire array
- **Property-level validation:** Individual validators for each property
- **Type checking:** Each object property validated
- **Required properties:** Per-object required fields

**Example:**
```typescript
// Valid
{
  items: [
    { name: 'Laptop', quantity: 2, price: 999.99, category: 'electronics' },
    { name: 'T-Shirt', quantity: 5, price: 19.99, category: 'clothing' },
  ]
}

// Invalid: second item has negative price
{
  items: [
    { name: 'Laptop', quantity: 2, price: 999.99, category: 'electronics' },
    { name: 'T-Shirt', quantity: 5, price: -19.99, category: 'clothing' },
  ]
}
```

---

### `at_least_one_of`

Validates that at least one field from a group has a value. Useful when you have multiple optional fields but require at least one to be filled.

```typescript
{
  contact_email: {
    at_least_one_of: {
      fields: ['contact_email', 'contact_phone', 'contact_address'],
    },
  },
  contact_phone: {
    at_least_one_of: {
      fields: ['contact_email', 'contact_phone', 'contact_address'],
    },
  },
  contact_address: {
    at_least_one_of: {
      fields: ['contact_email', 'contact_phone', 'contact_address'],
    },
  },
}
```

**Features:**
- **Group validation:** Checks if ANY field in the group has a value
- **Conditional requirement:** Optional `required_depends_on` for conditional validation
- **Flexible:** Works with strings, numbers, booleans, and arrays
- **Empty detection:** Treats `''`, `null`, `undefined`, and `[]` as empty

**Example:**
```typescript
// Invalid: None of the contact fields have values
{
  contact_email: '',
  contact_phone: '',
  contact_address: '',
}
// Error on all three fields: "At least one must be selected"

// Valid: At least one contact method provided
{
  contact_email: 'user@example.com',
  contact_phone: '',
  contact_address: '',
}
```

**With Conditional Requirement:**
```typescript
{
  social_facebook: {
    at_least_one_of: {
      fields: ['social_facebook', 'social_twitter', 'social_instagram'],
      required_depends_on: { key: 'has_social', value: 'yes' },
    },
  },
  // Same config for social_twitter and social_instagram
}
```

When `has_social = 'yes'`, at least one social media field must have a value.

---

## Advanced Usage

### Conditional Validation

Create fields that are only required when certain conditions are met:

```typescript
const checkoutSchema: ValidationDescription = {
  shipping_method: {
    required: true,
    oneof: ['standard', 'express', 'pickup'],
  },
  shipping_address: {
    required_depends_on: { key: 'shipping_method', value: 'standard' },
    shapeOf: {
      shape: {
        street: 'string',
        city: 'string',
        state: 'string',
        zip: 'string',
      },
      required: ['street', 'city', 'state', 'zip'],
    },
  },
  pickup_location: {
    required_depends_on: { key: 'shipping_method', value: 'pickup' },
    oneof: ['store_1', 'store_2', 'store_3'],
  },
};
```

### Nested Object Validation

Validate complex nested structures:

```typescript
const orderSchema: ValidationDescription = {
  customer: {
    required: true,
    shapeOf: {
      shape: {
        name: 'string',
        email: 'string',
        phone: 'string',
      },
      required: ['name', 'email'],
      validators: {
        email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string),
        phone: (phone) => /^\d{10}$/.test(phone as string),
      },
    },
  },
  items: {
    required: true,
    arrayOfShapes: {
      shape: {
        product_id: 'string',
        quantity: 'number',
        price: 'number',
      },
      required: ['product_id', 'quantity', 'price'],
      validators: {
        _array: (items) => items.length > 0 && items.length <= 50,
        quantity: (qty) => qty > 0 && qty <= 100,
        price: (price) => price >= 0,
      },
    },
  },
  total: {
    required: true,
    regexp: /^\d+\.\d{2}$/,
  },
};
```

### Custom Validators

Create reusable custom validation functions:

```typescript
// Custom validators
const isValidUUID = (value: unknown): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value as string);
};

const isValidBarcode = (value: unknown): boolean => {
  const code = value as string;
  return /^\d{8,14}$/.test(code) && hasValidChecksum(code);
};

const isStrongPassword = (value: unknown): boolean => {
  const password = value as string;
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

// Use in schema
const userSchema: ValidationDescription = {
  id: {
    required: true,
    shapeOf: {
      shape: { uuid: 'string' },
      required: ['uuid'],
      validators: { uuid: isValidUUID },
    },
  },
  password: {
    required: true,
    shapeOf: {
      shape: { value: 'string' },
      required: ['value'],
      validators: { value: isStrongPassword },
    },
  },
};
```

### Multiple Type Options

Validate fields that can be multiple types:

```typescript
{
  value: {
    shapeOf: {
      shape: {
        data: ['string', 'number'],  // Can be string OR number
      },
      required: ['data'],
    },
  }
}
```

---

## API Reference

### Main Function

#### `validate(input, schema)`

Validates input data against a schema.

**Parameters:**
- `input: ValidationInput` - The data to validate (object with string keys)
- `schema: ValidationDescription` - The validation schema

**Returns:**
- `ValidationError[]` - Array of validation errors (empty if valid)

**Example:**
```typescript
const errors = validate(userData, userSchema);
if (errors.length === 0) {
  // Data is valid
}
```

---

### Validator Class

You can also use the Validator class directly for more control:

```typescript
import Validator from '@molinit/validator/Validator';

const validator = new Validator();

// Validate individual fields
const error = validator.validate_required('email', '', true, {});
// Returns: { field: 'email', message: 'Missing required field' }

const error2 = validator.validate_regexp(
  'email',
  'invalid',
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  {}
);
// Returns: { field: 'email', message: "Field doesn't match the required pattern" }
```

#### Available Methods

- `validate_required(field, value, options, input)`
- `validate_required_depends_on(field, value, options, input)`
- `validate_minLength(field, value, options, input)`
- `validate_maxLength(field, value, options, input)`
- `validate_regexp(field, value, options, input)`
- `validate_equal(field, value, options, input)`
- `validate_oneof(field, value, options, input)`
- `validate_array(field, value, options, input)`
- `validate_array_items(field, value, options, input)`
- `validate_shapeOf(field, value, options, input)`
- `validate_arrayOfShapes(field, value, options, input)`
- `validate_at_least_one_of(field, value, options, input)`

---

## Examples

### Basic User Registration

```typescript
const registrationSchema: ValidationDescription = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    regexp: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    required: true,
    regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 8,
  },
  terms_accepted: {
    required: true,
    equal: 'yes',
  },
};

const userData = {
  username: 'alice_2024',
  email: 'alice@example.com',
  password: 'SecurePass123!',
  terms_accepted: 'yes',
};

const errors = validate(userData, registrationSchema);
// errors = [] (valid)
```

### E-commerce Product

```typescript
const productSchema: ValidationDescription = {
  sku: {
    required: true,
    regexp: /^[A-Z]{3}-\d{4}$/,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  category: {
    required: true,
    oneof: ['electronics', 'clothing', 'food', 'books'],
  },
  price: {
    required: true,
    regexp: /^\d+\.\d{2}$/,
  },
  tags: {
    array: true,
    array_items: ['new', 'sale', 'featured', 'popular', 'clearance'],
  },
  inventory: {
    required: true,
    shapeOf: {
      shape: {
        quantity: 'number',
        location: 'string',
        restock_date: 'string',
      },
      required: ['quantity', 'location'],
      validators: {
        quantity: (qty) => (qty as number) >= 0,
      },
    },
  },
};
```

### Wine Listing (Real-World Example)

```typescript
const wineListing Schema: ValidationDescription = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  vintage: {
    required: true,
    regexp: /^\d{4}$/,
  },
  wine_type: {
    required: true,
    oneof: ['red', 'white', 'rose', 'sparkling', 'dessert'],
  },
  origin_country: {
    required: true,
    regexp: /^[A-Z]{2}$/,  // ISO country codes
  },
  grapes: {
    required: true,
    arrayOfShapes: {
      shape: {
        name: 'string',
        percentage: 'string',
      },
      required: ['name', 'percentage'],
      validators: {
        _array: (grapes) => {
          // Percentages must sum to 100
          const total = grapes.reduce((sum, g) => sum + parseInt(g.percentage), 0);
          return total === 100;
        },
        percentage: (pct) => {
          const num = parseInt(pct as string);
          return num >= 0 && num <= 100;
        },
      },
    },
  },
  barcode: {
    required_depends_on: { key: 'require_barcode', value: '1' },
    shapeOf: {
      shape: {
        code: 'string',
        type: ['EAN8', 'EAN13', 'UPC', 'GTIN14', 'unknown'],
        normalized_gtin: 'string',
      },
      validators: {
        code: (code) => /^\d{8,14}$/.test(code as string),
      },
      required: ['code', 'type'],
    },
  },
};
```

---

## TypeScript Support

### Full Type Definitions

```typescript
import {
  ValidationDescription,
  ValidationAttributes,
  ValidationError,
  ValidationInput,
  ShapeOfValidation,
  ArrayOfShapesValidation,
} from '@molinit/validator/types';

// Define typed schemas
const schema: ValidationDescription = {
  // Your schema here
};

// Type-safe error handling
const errors: ValidationError[] = validate(input, schema);

// Custom validators are type-safe
const customValidator = (value: unknown): boolean => {
  // Your validation logic
  return true;
};
```

### Type Inference

The validator provides excellent type inference for your schemas:

```typescript
const schema = {
  email: {
    required: true,
    regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} satisfies ValidationDescription;

// TypeScript knows all available validation rules
```

---

## Best Practices

### 1. Define Schemas as Constants

```typescript
// ✅ Good: Reusable schema
export const USER_SCHEMA: ValidationDescription = {
  email: { required: true, regexp: /.../ },
};

// ❌ Bad: Inline schema
const errors = validate(data, { email: { required: true } });
```

### 2. Use Custom Validators for Complex Logic

```typescript
// ✅ Good: Reusable, testable validator
const isValidCreditCard = (value: unknown): boolean => {
  const num = value as string;
  return luhnCheck(num) && num.length >= 13;
};

// ❌ Bad: Complex regex
regexp: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|...)$/
```

### 3. Group Related Schemas

```typescript
// schemas/user.ts
export const USER_SCHEMA = { /* ... */ };
export const USER_PROFILE_SCHEMA = { /* ... */ };

// schemas/product.ts
export const PRODUCT_SCHEMA = { /* ... */ };
export const PRODUCT_VARIANT_SCHEMA = { /* ... */ };
```

### 4. Provide Clear Error Messages

The validator provides default error messages, but you can wrap it for custom messages:

```typescript
const errors = validate(data, schema);
if (errors.length > 0) {
  const customErrors = errors.map(err => ({
    ...err,
    message: getCustomMessage(err.field, err.message),
  }));
}
```

### 5. Test Your Schemas

```typescript
describe('User Schema', () => {
  it('should validate valid user data', () => {
    const validUser = { email: 'test@example.com', age: '25' };
    const errors = validate(validUser, USER_SCHEMA);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid email', () => {
    const invalidUser = { email: 'invalid', age: '25' };
    const errors = validate(invalidUser, USER_SCHEMA);
    expect(errors).toContainEqual({
      field: 'email',
      message: expect.stringContaining('pattern'),
    });
  });
});
```

---

## Common Patterns

### Optional Fields with Constraints

```typescript
{
  bio: {
    required: false,
    minLength: 10,    // If provided, must be at least 10 chars
    maxLength: 500,   // And at most 500 chars
  }
}
```

### Mutually Exclusive Fields

```typescript
{
  email: {
    required_depends_on: { key: 'contact_method', value: 'email' },
    regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required_depends_on: { key: 'contact_method', value: 'phone' },
    regexp: /^\d{10}$/,
  },
}
```

### Percentage Validation

```typescript
const grapes = {
  arrayOfShapes: {
    shape: {
      name: 'string',
      percentage: 'number',
    },
    required: ['name', 'percentage'],
    validators: {
      _array: (items) => {
        const total = items.reduce((sum, item) => sum + item.percentage, 0);
        return total === 100;
      },
      percentage: (pct) => pct >= 0 && pct <= 100,
    },
  },
};
```

---

## Error Handling

### Accessing Errors

```typescript
const errors = validate(data, schema);

// Check if valid
if (errors.length === 0) {
  console.log('Valid!');
}

// Get specific field errors
const emailErrors = errors.filter(e => e.field === 'email');

// Group errors by field
const errorsByField = errors.reduce((acc, err) => {
  if (!acc[err.field]) acc[err.field] = [];
  acc[err.field].push(err.message);
  return acc;
}, {} as Record<string, string[]>);
```

### Custom Error Handling

```typescript
function validateWithCustomErrors(data: any, schema: ValidationDescription) {
  const errors = validate(data, schema);
  
  return errors.map(err => ({
    field: err.field,
    message: err.message,
    code: getErrorCode(err.message),
    severity: getSeverity(err.field),
  }));
}
```

---

## Performance Tips

1. **Reuse Validator Instance:** The validator is stateless and can be reused
2. **Cache Schemas:** Define schemas once as constants
3. **Lazy Validation:** Only validate fields that changed
4. **Optimize Custom Validators:** Keep custom validators fast and simple

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
git clone https://github.com/molinit/validator
cd validator
npm install
npm test
```

### Running Tests

```bash
npm test                 # Run all tests
npm test -- --watch      # Watch mode
npm test -- --coverage   # With coverage
```

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/molinit/validator/issues)
- **Discussions:** [GitHub Discussions](https://github.com/molinit/validator/discussions)
- **Email:** support@molinit.com

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Made with ❤️ by the YourOrg team**


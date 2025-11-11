# Validator Quick Reference

A one-page reference guide for the Validator library.

## Installation

```bash
npm install @molinit/validator
```

## Basic Usage

```typescript
import validate from '@molinit/validator';
import { ValidationDescription } from '@molinit/validator/types';

const schema: ValidationDescription = {
  email: { required: true, regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  age: { required: true, minLength: 1, maxLength: 3 },
};

const errors = validate({ email: 'test@example.com', age: '25' }, schema);
// errors = [] if valid
```

---

## All Validation Rules

| Rule                  | Purpose                                       | Example                                                 |
| --------------------- | --------------------------------------------- | ------------------------------------------------------- |
| `required`            | Field must exist and not be empty             | `required: true`                                        |
| `required_depends_on` | Required if another field has specific value  | `required_depends_on: { key: 'type', value: 'custom' }` |
| `minLength`           | Minimum string length                         | `minLength: 5`                                          |
| `maxLength`           | Maximum string length                         | `maxLength: 100`                                        |
| `regexp`              | Match regular expression                      | `regexp: /^\d{5}$/`                                     |
| `equal`               | Must equal specific value                     | `equal: 'yes'`                                          |
| `oneof`               | Must be one of allowed values                 | `oneof: ['red', 'green', 'blue']`                       |
| `array`               | Must be an array                              | `array: true`                                           |
| `array_items`         | Array items must be in allowed list           | `array_items: ['option1', 'option2']`                   |
| `shapeOf`             | Validate object structure                     | `shapeOf: { shape: {...}, required: [...] }`            |
| `arrayOfShapes`       | Validate array of objects                     | `arrayOfShapes: { shape: {...}, validators: {...} }`    |
| `at_least_one_of`     | At least one field from group must have value | `at_least_one_of: { fields: [...] }`                    |

---

## Rule Details

### required

```typescript
{
  username: {
    required: true;
  }
}
```

- Value must exist
- Cannot be `undefined`, `null`, or empty string
- For arrays: must have at least one item

---

### required_depends_on

```typescript
{
  shipping_address: {
    required_depends_on: { key: 'needs_shipping', value: '1' }
  }
}
```

- Field only required when condition is met
- Checks if another field equals specific value

---

### minLength / maxLength

```typescript
{ username: { minLength: 3, maxLength: 20 } }
```

- Validates string length
- Works with `.toString()` conversion

---

### regexp

```typescript
{
  email: {
    regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  }
}
```

- Pattern matching validation
- Tests value against regex

---

### equal

```typescript
{
  terms: {
    equal: 'I agree';
  }
}
```

- Value must exactly match
- Strict equality check

---

### oneof

```typescript
{
  status: {
    oneof: ['draft', 'published', 'archived'];
  }
}
```

- Enum validation
- Value must be in allowed list

---

### array

```typescript
{ tags: { array: true, required: true } }
```

- Validates field is an array
- With `required: true`, ensures at least one item

---

### array_items

```typescript
{
  tags: {
    array: true,
    array_items: ['javascript', 'python', 'rust']
  }
}
```

- All array items must be in allowed list
- Supports primitives and objects (deep comparison)

---

### shapeOf

```typescript
{
  address: {
    shapeOf: {
      shape: {
        street: 'string',
        city: 'string',
        country: ['US', 'CA', 'MX'],  // Enum
      },
      required: ['street', 'city'],
      validators: {
        street: (val) => val.length >= 5,
      },
    },
  }
}
```

**Features:**

- Type checking (`'string'`, `'number'`, `'boolean'`)
- Enum validation (array of allowed values)
- Required properties
- Custom validators per property

---

### arrayOfShapes

```typescript
{
  items: {
    arrayOfShapes: {
      shape: {
        name: 'string',
        quantity: 'number',
        category: ['electronics', 'food'],
      },
      required: ['name', 'quantity'],
      validators: {
        _array: (arr) => arr.length <= 100,    // Array-level
        quantity: (qty) => qty > 0,            // Property-level
      },
    },
  }
}
```

**Features:**

- Array-level validation (`_array`)
- Per-property validation
- Type checking for each object
- Required properties per object

---

### at_least_one_of

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

- Group validation (any field must have value)
- Conditional requirement (`required_depends_on`)
- Works with strings, numbers, booleans, arrays
- Empty detection (`''`, `null`, `undefined`, `[]`)

**With condition:**

```typescript
{
  social_facebook: {
    at_least_one_of: {
      fields: ['social_facebook', 'social_twitter', 'social_instagram'],
      required_depends_on: { key: 'has_social', value: 'yes' },
    },
  },
  // Same for other social fields
}
```

---

## Type Reference

```typescript
// Schema type
type ValidationDescription = {
  [fieldName: string]: ValidationAttributes;
};

// Field rules
type ValidationAttributes = {
  required?: boolean;
  required_depends_on?: { key: string; value: string | number };
  minLength?: number;
  maxLength?: number;
  regexp?: RegExp;
  equal?: string | number;
  oneof?: string[];
  array?: boolean;
  array_items?: unknown[];
  shapeOf?: ShapeOfValidation;
  arrayOfShapes?: ArrayOfShapesValidation;
  at_least_one_of?: {
    fields: string[];
    required_depends_on?: { key: string; value: string | number };
  };
};

// Shape validation
type ShapeOfValidation = {
  shape: Record<string, 'string' | 'number' | 'boolean' | string[]>;
  validators?: { [key: string]: (value: unknown) => boolean };
  required?: string[];
};

// Error format
type ValidationError = {
  field: string;
  message: string;
};
```

---

## Common Patterns

### Basic Form Validation

```typescript
const schema = {
  email: { required: true, regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { required: true, minLength: 8 },
  age: { required: true, regexp: /^\d+$/ },
};
```

### Conditional Fields

```typescript
const schema = {
  account_type: { required: true, oneof: ['personal', 'business'] },
  company_name: {
    required_depends_on: { key: 'account_type', value: 'business' },
    minLength: 2,
  },
};
```

### Nested Object

```typescript
const schema = {
  user: {
    shapeOf: {
      shape: {
        name: 'string',
        email: 'string',
        age: 'number',
      },
      required: ['name', 'email'],
      validators: {
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string),
        age: (v) => (v as number) >= 18,
      },
    },
  },
};
```

### Array of Objects

```typescript
const schema = {
  items: {
    arrayOfShapes: {
      shape: {
        id: 'string',
        quantity: 'number',
        price: 'number',
      },
      required: ['id', 'quantity', 'price'],
      validators: {
        _array: (arr) => arr.length > 0 && arr.length <= 100,
        quantity: (q) => q > 0,
        price: (p) => p >= 0,
      },
    },
  },
};
```

---

## Error Handling

```typescript
const errors = validate(data, schema);

// Check if valid
if (errors.length === 0) {
  // Valid!
}

// Get errors for specific field
const emailErrors = errors.filter((e) => e.field === 'email');

// Group errors by field
const errorsByField = errors.reduce((acc, err) => {
  acc[err.field] = acc[err.field] || [];
  acc[err.field].push(err.message);
  return acc;
}, {});
```

---

## Custom Validators

```typescript
// Define reusable validator
const isValidUUID = (value: unknown): boolean => {
  const uuid = value as string;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid,
  );
};

// Use in schema
const schema = {
  id: {
    shapeOf: {
      shape: { uuid: 'string' },
      required: ['uuid'],
      validators: { uuid: isValidUUID },
    },
  },
};
```

---

## Tips

1. **Define schemas as constants** for reusability
2. **Use custom validators** for complex logic
3. **Test your schemas** with unit tests
4. **Group related schemas** in separate files
5. **Reuse validator instances** for performance

---

## Example: Complete User Registration

```typescript
import validate from '@molinit/validator';
import { ValidationDescription } from '@molinit/validator/types';

const REGISTRATION_SCHEMA: ValidationDescription = {
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
  password_confirmation: {
    required: true,
    equal: 'password', // Would need custom logic
  },
  age: {
    required: true,
    regexp: /^\d+$/,
  },
  terms_accepted: {
    required: true,
    equal: 'yes',
  },
  newsletter: {
    required: false,
    oneof: ['yes', 'no'],
  },
  interests: {
    array: true,
    array_items: ['sports', 'music', 'technology', 'travel', 'food'],
  },
  address: {
    required_depends_on: { key: 'needs_delivery', value: 'yes' },
    shapeOf: {
      shape: {
        street: 'string',
        city: 'string',
        state: 'string',
        zip: 'string',
        country: ['US', 'CA', 'MX'],
      },
      required: ['street', 'city', 'state', 'zip', 'country'],
      validators: {
        zip: (zip) => /^\d{5}(-\d{4})?$/.test(zip as string),
      },
    },
  },
};

// Validate user registration data
function registerUser(data: any) {
  const errors = validate(data, REGISTRATION_SCHEMA);

  if (errors.length > 0) {
    console.error('Validation failed:', errors);
    return { success: false, errors };
  }

  // Process registration
  return { success: true };
}
```

---

**Quick Start:** Copy a pattern above and customize for your needs!

**Full Docs:** See [README.md](README.md) for complete documentation.

# @molinit/validator

[![npm version](https://img.shields.io/npm/v/@molinit/validator.svg)](https://www.npmjs.com/package/@molinit/validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A flexible, type-safe validation library for TypeScript/JavaScript with declarative schema-based validation.

## Features

✅ **Declarative validation** - Define rules as data structures  
✅ **Type-safe** - Full TypeScript support with strict typing  
✅ **Extensible** - Add custom validation functions  
✅ **Conditional validation** - Fields required based on other fields  
✅ **Complex structures** - Validate objects, arrays, and nested data  
✅ **Zero dependencies** - Lightweight and fast  

## Quick Start

```bash
npm install @molinit/validator
```

```typescript
import validate from '@molinit/validator';

const schema = {
  email: { required: true, regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  age: { required: true, minLength: 1, maxLength: 3 },
  role: { oneof: ['admin', 'user', 'guest'] },
};

const errors = validate({ email: 'user@example.com', age: '25', role: 'user' }, schema);
// errors = [] (valid!)
```

## Documentation

- 📖 [Full Documentation](./README.md)
- ⚡ [Quick Reference](./QUICK_REFERENCE.md)
- 🤝 [Contributing Guide](./CONTRIBUTING.md)
- 📝 [Changelog](./CHANGELOG.md)

## Validation Rules

- `required` - Field must exist
- `required_depends_on` - Conditional requirements
- `minLength` / `maxLength` - Length constraints
- `regexp` - Pattern matching
- `equal` - Exact value match
- `oneof` - Enum validation
- `array` - Array validation
- `array_items` - Array item validation
- `shapeOf` - Object structure validation
- `arrayOfShapes` - Array of objects validation

## Example

```typescript
import validate from '@molinit/validator';
import { ValidationDescription } from '@molinit/validator/types';

const userSchema: ValidationDescription = {
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
  profile: {
    shapeOf: {
      shape: {
        name: 'string',
        bio: 'string',
        age: 'number',
      },
      required: ['name'],
      validators: {
        age: (age) => (age as number) >= 18,
      },
    },
  },
};

const userData = {
  username: 'alice_2024',
  email: 'alice@example.com',
  profile: {
    name: 'Alice Johnson',
    bio: 'Software developer',
    age: 25,
  },
};

const errors = validate(userData, userSchema);
if (errors.length === 0) {
  console.log('Valid!');
} else {
  console.error('Validation errors:', errors);
}
```

## TypeScript Support

Fully typed with TypeScript:

```typescript
import {
  ValidationDescription,
  ValidationError,
  ValidationInput,
  ShapeOfValidation,
} from '@molinit/validator/types';
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT © Molinit

## Support

- 🐛 [Report Issues](https://github.com/molinit/validator/issues)
- 💬 [Discussions](https://github.com/molinit/validator/discussions)
- 📧 Email: contact@molinit.com


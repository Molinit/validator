# Contributing to Validator

Thank you for your interest in contributing to Validator! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Adding New Validators](#adding-new-validators)
- [Documentation](#documentation)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful, inclusive, and harassment-free environment for everyone.

---

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally (replace `YOUR_USERNAME` with your GitHub username):
   ```bash
   git clone https://github.com/YOUR_USERNAME/validator.git
   cd validator
   ```
3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/molinit/validator.git
   ```
4. **Install dependencies:**
   ```bash
   npm install
   ```

---

## Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- TypeScript knowledge

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Check Types

```bash
npm run type-check
```

### Lint Code

```bash
npm run lint
```

### Format Code with Prettier

```bash
npm run prettier
```

### Format and Lint (Combined)

```bash
npm run format
```

---

## Project Structure

```
validate/
├── Validator.ts           # Main validator class
├── types.ts               # TypeScript type definitions
├── constants.ts           # Common regex patterns
├── index.ts               # Main export and validate function
├── README.md              # Full documentation
├── QUICK_REFERENCE.md     # Quick reference guide
├── CONTRIBUTING.md        # This file
└── __tests__/
    └── Validator.test.ts  # Test suite
```

---

## Making Changes

### Branching Strategy

- `main` - Stable releases
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Workflow

1. **Create a branch:**

   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes**

3. **Format and lint your code:**

   ```bash
   npm run format
   ```

4. **Commit with clear messages:**

   ```bash
   git commit -m "Add: New validation rule for email domains"
   ```

5. **Push to your fork:**

   ```bash
   git push origin feature/my-new-feature
   ```

6. **Create a Pull Request** on GitHub

---

## Testing

### Writing Tests

All validation methods should have comprehensive test coverage:

```typescript
describe('validate_myNewRule', () => {
  const validator = new Validator();

  it('should pass for valid values', () => {
    const result = validator.validate_myNewRule(
      'field',
      'valid-value',
      options,
      {},
    );
    expect(result).toBeUndefined();
  });

  it('should fail for invalid values', () => {
    const result = validator.validate_myNewRule(
      'field',
      'invalid-value',
      options,
      {},
    );
    expect(result).toEqual({
      field: 'field',
      message: 'Field failed validation',
    });
  });

  it('should handle edge cases', () => {
    // Test null, undefined, empty values, etc.
  });
});
```

### Test Coverage

- Aim for 100% code coverage
- Test both success and failure cases
- Test edge cases (null, undefined, empty, etc.)
- Test error messages
- Test with different data types

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test Validator.test.ts

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## Coding Standards

### TypeScript

- Use strict TypeScript mode
- Provide explicit type annotations
- Avoid `any` type (use `unknown` instead)
- Use type guards where appropriate

### Naming Conventions

- **Classes:** PascalCase (`Validator`)
- **Methods:** camelCase (`validate_required`)
- **Constants:** UPPER_SNAKE_CASE (`UUID_REGEXP`)
- **Types:** PascalCase (`ValidationError`)
- **Interfaces:** PascalCase with `I` prefix if needed

### Code Style

**We use Prettier for automatic code formatting. Run `npm run format` before committing.**

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 80 characters (enforced by Prettier)
- Trailing commas in multi-line structures
- Add JSDoc comments for public methods

**Note:** Most style issues are automatically fixed by Prettier. Focus on writing clear, readable code.

### Example

```typescript
/**
 * Validates that a field matches a specific pattern
 *
 * @param field - The field name being validated
 * @param value - The value to validate
 * @param options - The regex pattern to match
 * @param input - The full input object
 * @returns ValidationError if invalid, undefined if valid
 */
validate_myRule = (
  field: string,
  value: unknown,
  options: RegExp | undefined,
  input: ValidationInput,
): ValidationError | undefined => {
  // Implementation
};
```

---

## Submitting Changes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Code is formatted (`npm run format`)
- [ ] All tests pass (`npm test`)
- [ ] New tests added for new features
- [ ] Types are correct (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation updated (README, QUICK_REFERENCE)
- [ ] Commit messages are clear and descriptive
- [ ] No breaking changes (or clearly documented)

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe testing performed

## Checklist

- [ ] Tests pass
- [ ] Documentation updated
- [ ] Types correct
- [ ] Lint passes
```

---

## Adding New Validators

### Step 1: Add Method to Validator Class

```typescript
// In Validator.ts
validate_myNewRule = (
  field: string,
  value: unknown,
  options: AttributeValueType<'myNewRule'>,
  input: ValidationInput,
): ValidationError | undefined => {
  if (!value || !options) return undefined;

  // Validation logic
  if (/* validation fails */) {
    return {
      field,
      message: 'Field failed validation',
    };
  }

  return undefined;
};
```

### Step 2: Add Type Definition

```typescript
// In types.ts
export type ValidationAttributes = {
  // ...existing attributes
  myNewRule?: MyNewRuleOptions; // Add your rule
};

export type MyNewRuleOptions = {
  // Define options structure
};
```

### Step 3: Add Tests

```typescript
// In Validator.test.ts
describe('validate_myNewRule', () => {
  const validator = new Validator();

  it('should validate correctly', () => {
    // Add test cases
  });
});
```

### Step 4: Update Documentation

````typescript
// In README.md
### `myNewRule`

Description of the rule.

```typescript
{
  field: {
    myNewRule: options,
  }
}
````

**Example:**

```typescript
// Show usage example
```

````

### Step 5: Update Quick Reference

Add entry to `QUICK_REFERENCE.md` with:
- Rule name
- Purpose
- Example usage

---

## Documentation

### README.md

- Comprehensive documentation
- Include examples for each feature
- Update API reference
- Add to examples section

### QUICK_REFERENCE.md

- One-page reference
- Concise examples
- Common patterns

### Inline Comments

- Document complex logic
- Explain non-obvious decisions
- Add TODOs with context

### JSDoc Comments

```typescript
/**
 * Brief description of method
 *
 * @param field - Description
 * @param value - Description
 * @param options - Description
 * @param input - Description
 * @returns Description
 *
 * @example
 * ```typescript
 * const result = validator.validate_method('email', 'test@example.com', options, {});
 * ```
 */
````

---

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

### Release Steps

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag
4. Push to GitHub
5. Publish to npm

---

## Common Issues

### Tests Failing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Type Errors

```bash
# Check types
npm run type-check

# Rebuild types
npm run build
```

### Lint Errors

```bash
# Auto-fix linting issues
npm run lint:fix
```

### Formatting Issues

```bash
# Format all files
npm run prettier

# Format and lint together
npm run format
```

---

## Getting Help

- **Issues:** [GitHub Issues](https://github.com/molinit/validator/issues)
- **Discussions:** [GitHub Discussions](https://github.com/molinit/validator/discussions)
- **Email:** dev@molinit.com

---

## Recognition

Contributors will be:

- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Credited in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Validator! 🎉

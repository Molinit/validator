# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-11-11

### Fixed

- Package exports configuration for clean imports
  - Added `exports` field to package.json
  - Users can now import from `@molinit/validator` instead of `@molinit/validator/dist`
  - Supports subpath imports: `@molinit/validator/types`, `@molinit/validator/constants`, `@molinit/validator/Validator`
  - No breaking changes - maintains backward compatibility

## [1.0.1] - 2025-11-11

### Added

- `validate_at_least_one_of` - Group validation requiring at least one field to have a value
  - Validates that at least one field from a group has a meaningful value
  - Supports conditional requirements via `required_depends_on`
  - Works with strings, numbers, booleans, and arrays
  - Returns error on all fields in the group when none have values
- 18 comprehensive tests for `at_least_one_of` validator
- Documentation for `at_least_one_of` in README.md and QUICK_REFERENCE.md

## [1.0.0] - 2025-11-11

### Added

- Initial release of @molinit/validator
- Core validation methods:
  - `validate_required` - Required field validation
  - `validate_required_depends_on` - Conditional required validation
  - `validate_minLength` / `validate_maxLength` - Length constraints
  - `validate_regexp` - Regular expression pattern matching
  - `validate_equal` - Exact value matching
  - `validate_oneof` - Enum validation
  - `validate_array` - Array validation
  - `validate_array_items` - Array item validation
  - `validate_shapeOf` - Object structure validation
  - `validate_arrayOfShapes` - Array of objects validation
- TypeScript type definitions for all validation rules
- Comprehensive documentation (README.md, QUICK_REFERENCE.md)
- Contributing guidelines
- Full test suite with 45 tests
- Support for custom validators
- Support for conditional validation
- Support for nested object validation

### Features

- Declarative schema-based validation
- Type-safe with full TypeScript support
- Extensible with custom validation functions
- Clear, actionable error messages
- Zero dependencies (dev dependencies only)

[1.0.0]: https://github.com/molinit/validator/releases/tag/v1.0.0

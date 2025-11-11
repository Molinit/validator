/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import {
  AttributeValueType,
  PrimitiveValue,
  ShapeOfValidation,
  ValidationAttributes,
  ValidationError,
  ValidationInput,
} from './types';

class Validator {
  /*
   *
   *   validate_required
   *   Check if a field exists and is not empty or falsy
   *
   */
  validate_required = (
    field: string,
    value: PrimitiveValue,
    options: AttributeValueType<'required'>,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (!options) return undefined;

    // Check if this field has array validation rules
    const fieldConfig = (
      _input as unknown as { __fieldConfig?: ValidationAttributes }
    ).__fieldConfig;
    const hasArrayRule = fieldConfig?.array || fieldConfig?.array_items;

    // Standard falsy check for non-array fields
    if (!value || value === '') {
      return {
        field,
        message: 'Missing required field',
      };
    }

    // Only check for empty arrays if array validation rules are present
    if (hasArrayRule && Array.isArray(value) && value.length === 0) {
      return {
        field,
        message: 'Missing required field',
      };
    }

    return undefined;
  };

  /*
   *
   *   validate_required_depends_on
   *   Check if a field is required based on another field's value
   *   Options format: { key: 'field_name', value: 'expected_value' }
   *
   */
  validate_required_depends_on = (
    field: string,
    value: unknown,
    options: AttributeValueType<'required_depends_on'>,
    input: ValidationInput,
  ): ValidationError | undefined => {
    if (!options) return undefined;

    const { key, value: expectedValue } = options;
    const dependentFieldValue = input[key];

    // Check if the dependent field matches the expected value
    const isConditionMet = dependentFieldValue === expectedValue;

    // If condition is met, field becomes required
    if (isConditionMet) {
      // Check if this field has array validation rules
      const fieldConfig = (
        input as unknown as { __fieldConfig?: ValidationAttributes }
      ).__fieldConfig;
      const hasArrayRule = fieldConfig?.array || fieldConfig?.array_items;

      // Standard falsy check for non-array fields
      if (!value || value === '') {
        return {
          field,
          message: `Missing required field`,
        };
      }

      // Only check for empty arrays if array validation rules are present
      if (hasArrayRule && Array.isArray(value) && value.length === 0) {
        return {
          field,
          message: `Missing required field`,
        };
      }
    }

    return undefined;
  };

  /*
   *
   *   validate_minLength
   *   Validate the minimum length of a field
   *
   */
  validate_minLength = (
    field: string,
    value: PrimitiveValue,
    options: AttributeValueType<'minLength'>,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (value && options && value.toString().length < options) {
      return {
        field,
        message: 'Field value is too short',
      };
    }
  };

  /*
   *
   *   validate_maxLength
   *   Validate the maximum length of a field
   *
   */
  validate_maxLength = (
    field: string,
    value: PrimitiveValue,
    options: AttributeValueType<'maxLength'>,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (value && options && value.toString().length > options) {
      return {
        field,
        message: 'Field value is too long',
      };
    }
  };

  /*
   *
   *   validate_regexp
   *   Validate a field against a regular expression
   *
   */
  validate_regexp = (
    field: string,
    value: PrimitiveValue,
    options: AttributeValueType<'regexp'>,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (value && options && !options.test(value.toString())) {
      return {
        field,
        message: "Field doesn't match the required pattern",
      };
    }
  };

  /*
   *
   *   validate_equal
   *   Validate field is the same as option
   *
   */
  validate_equal = (
    field: string,
    value: PrimitiveValue,
    options: AttributeValueType<'equal'>,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (value && options && value !== options) {
      return {
        field,
        message: 'Field value is not equal to expected value',
      };
    }
  };

  /*
   *
   *   validate_oneof
   *   Validate field is one of values in the options array
   *
   */
  validate_oneof = (
    field: string,
    value: PrimitiveValue,
    options: AttributeValueType<'oneof'>,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (value && options && !options.includes(value as string)) {
      return {
        field,
        message: 'Field value is not one of the expected values',
      };
    }
  };

  /*
   *
   *   validate_array
   *   Validates that the field is an array
   *   When used with required: true, ensures at least one item exists
   *
   */
  validate_array = (
    field: string,
    value: PrimitiveValue,
    options: AttributeValueType<'array'>,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (!options) return undefined;

    const arrayValue = value as unknown;

    // Check if value is an array
    if (arrayValue && !Array.isArray(arrayValue)) {
      return {
        field,
        message: 'Field must be an array',
      };
    }

    // Note: required validation is handled separately by validate_required
    // This just validates the array structure

    return undefined;
  };

  /*
   *
   *   validate_array_items
   *   Validates that all items in the array are present in the allowed list
   *   Supports primitives (string, number, boolean) and objects (deep comparison)
   *
   */
  validate_array_items = (
    field: string,
    value: PrimitiveValue,
    allowedItems: AttributeValueType<'array_items'>,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (!value || !allowedItems) return undefined;

    const arrayValue = value as unknown;

    if (!Array.isArray(arrayValue)) {
      return {
        field,
        message: 'Field must be an array to validate items',
      };
    }

    if (arrayValue.length === 0) return undefined;

    // Helper function to compare items (supports primitives and objects)
    const itemsMatch = (item: unknown, allowedItem: unknown): boolean => {
      // For primitives, use strict equality
      if (
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'boolean'
      ) {
        return item === allowedItem;
      }

      // For objects, do deep comparison via JSON stringification
      try {
        return JSON.stringify(item) === JSON.stringify(allowedItem);
      } catch {
        return false;
      }
    };

    // Check if all items in the array are in the allowed list
    const invalidItems: unknown[] = [];

    for (const item of arrayValue) {
      const isValid = allowedItems.some((allowedItem) =>
        itemsMatch(item, allowedItem),
      );

      if (!isValid) {
        invalidItems.push(item);
      }
    }

    if (invalidItems.length > 0) {
      return {
        field,
        message: `Array contains invalid items: ${invalidItems.map((item) => JSON.stringify(item)).join(', ')}`,
      };
    }

    return undefined;
  };

  /*
   *
   *   validate_shapeOf
   *   Validates that the field is an object matching a specific shape
   *   with optional custom validation functions for each property
   *
   */
  validate_shapeOf = (
    field: string,
    value: unknown,
    options: ShapeOfValidation | undefined,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (!value || !options) return undefined;

    const objValue = value as unknown;

    // Check if value is an object
    if (
      typeof objValue !== 'object' ||
      objValue === null ||
      Array.isArray(objValue)
    ) {
      return {
        field,
        message: 'Field must be an object',
      };
    }

    const { shape, validators, required } = options;
    const obj = objValue as Record<string, unknown>;

    // Validate required properties
    if (required) {
      for (const requiredKey of required) {
        const key = requiredKey as string;
        if (
          !(key in obj) ||
          obj[key] === undefined ||
          obj[key] === null ||
          obj[key] === ''
        ) {
          return {
            field,
            message: `Missing required property: ${key}`,
          };
        }
      }
    }

    // Validate shape and types
    for (const [key, expectedType] of Object.entries(shape)) {
      const propValue = obj[key];

      // Skip validation for optional properties that are not present
      if (propValue === undefined || propValue === null) {
        if (required && required.includes(key as never)) {
          return {
            field,
            message: `Missing required property: ${key}`,
          };
        }
        continue;
      }

      // Type validation
      if (Array.isArray(expectedType)) {
        // If expectedType is an array, validate value is one of the allowed values (enum)
        if (!expectedType.includes(propValue as string)) {
          return {
            field,
            message: `Property "${key}" must be one of: ${expectedType.join(', ')}`,
          };
        }
      } else {
        // Standard type checking
        const actualType = typeof propValue;
        if (actualType !== expectedType) {
          return {
            field,
            message: `Property "${key}" must be of type ${expectedType}, got ${actualType}`,
          };
        }
      }

      // Custom validation functions
      if (validators && validators[key]) {
        const validatorFn = validators[key];
        if (validatorFn && typeof validatorFn === 'function') {
          try {
            const isValid = validatorFn(propValue);
            if (!isValid) {
              return {
                field: `${field}.${key}`,
                message: `Property "${key}" failed custom validation`,
              };
            }
          } catch (error) {
            return {
              field: `${field}.${key}`,
              message: `Property "${key}" validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            };
          }
        }
      }
    }

    return undefined;
  };

  /*
   *
   *   validate_arrayOfShapes
   *   Validates that the field is an array of objects matching a specific shape
   *   with optional custom validation functions for each property
   *   Supports array-level validation via _array validator
   *
   */
  validate_arrayOfShapes = (
    field: string,
    value: PrimitiveValue,
    options: AttributeValueType<'arrayOfShapes'>,
    _input: ValidationInput,
  ): ValidationError | undefined => {
    if (!value || !options) return undefined;

    const arrayValue = value as unknown;

    // Must be an array
    if (!Array.isArray(arrayValue)) {
      return {
        field,
        message: 'Field must be an array',
      };
    }

    // Empty array is valid (unless required is set separately)
    if (arrayValue.length === 0) return undefined;

    const { shape, validators, required } = options;

    // First, run array-level custom validator if provided
    if (validators?._array) {
      try {
        const isValid = validators._array(arrayValue);
        if (!isValid) {
          return {
            field,
            message: 'Array failed custom validation',
          };
        }
      } catch (error) {
        return {
          field,
          message: `Array validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };
      }
    }

    // Validate each item in the array
    for (let i = 0; i < arrayValue.length; i++) {
      const item = arrayValue[i];

      // Each item must be an object
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        return {
          field: `${field}[${i}]`,
          message: 'Array item must be an object',
        };
      }

      const obj = item as Record<string, unknown>;

      // Validate required properties
      if (required) {
        for (const requiredKey of required) {
          if (
            !(requiredKey in obj) ||
            obj[requiredKey] === undefined ||
            obj[requiredKey] === null ||
            obj[requiredKey] === ''
          ) {
            return {
              field: `${field}[${i}].${requiredKey}`,
              message: `Missing required property: ${requiredKey}`,
            };
          }
        }
      }

      // Validate shape and types
      for (const [key, expectedType] of Object.entries(shape)) {
        const propValue = obj[key];

        // Skip optional properties
        if (propValue === undefined || propValue === null) {
          if (required && required.includes(key as never)) {
            return {
              field: `${field}[${i}].${key}`,
              message: `Missing required property: ${key}`,
            };
          }
          continue;
        }

        // Type validation
        if (Array.isArray(expectedType)) {
          // Check if it's a list of type names (e.g., ['string', 'number'])
          const isMultipleTypes = expectedType.every((t) =>
            ['string', 'number', 'boolean', 'object'].includes(t as string),
          );

          if (isMultipleTypes) {
            // Multiple type validation - value must match one of the types
            const actualType = typeof propValue;
            if (!expectedType.includes(actualType)) {
              return {
                field: `${field}[${i}].${key}`,
                message: `Property "${key}" must be of type ${expectedType.join(' or ')}, got ${actualType}`,
              };
            }
          } else {
            // Enum validation - value must be one of the allowed string values
            if (!expectedType.includes(propValue as string)) {
              return {
                field: `${field}[${i}].${key}`,
                message: `Property "${key}" must be one of: ${expectedType.join(', ')}`,
              };
            }
          }
        } else if (
          expectedType === 'string' ||
          expectedType === 'number' ||
          expectedType === 'boolean' ||
          expectedType === 'object'
        ) {
          // Single type checking
          const actualType = typeof propValue;
          if (actualType !== expectedType) {
            return {
              field: `${field}[${i}].${key}`,
              message: `Property "${key}" must be of type ${expectedType}, got ${actualType}`,
            };
          }
        }

        // Custom property-level validators
        if (validators && validators[key] && key !== '_array') {
          const validatorFn = validators[key];
          if (validatorFn && typeof validatorFn === 'function') {
            try {
              const isValid = validatorFn(propValue);
              if (!isValid) {
                return {
                  field: `${field}[${i}].${key}`,
                  message: `Property "${key}" failed custom validation`,
                };
              }
            } catch (error) {
              return {
                field: `${field}[${i}].${key}`,
                message: `Property "${key}" validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
              };
            }
          }
        }
      }
    }

    return undefined;
  };
}

export default Validator;

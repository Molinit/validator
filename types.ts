export type PrimitiveValue = string | number | boolean;

export type ValidationInput = {
  [key: string]: unknown;
};

export type ValidationError = {
  field: string;
  message: string;
};

export type ShapeValidators = {
  // eslint-disable-next-line no-unused-vars
  [key: string]: ((value: unknown) => boolean) | undefined;
};

export type ShapeOfValidation = {
  shape: Record<
    string,
    string | 'string' | 'number' | 'boolean' | 'object' | string[]
  >; // Type definitions for each property
  validators?: ShapeValidators; // Optional custom validation functions
  required?: string[]; // Required properties in the shape
};

export type ArrayOfShapesValidation = {
  shape: Record<string, 'string' | 'number' | 'boolean' | 'object' | string[]>; // Type definitions for each property
  // eslint-disable-next-line no-unused-vars
  validators?: ShapeValidators & { _array?: (value: unknown) => boolean }; // Property-level + array-level validators
  required?: string[]; // Required properties in each object
};

export type ValidationAttributes = {
  required?: boolean;
  required_depends_on?: { key: string; value: string | number };
  minLength?: number;
  maxLength?: number;
  regexp?: RegExp;
  equal?: string | number;
  oneof?: string[];
  array?: boolean; // Validates field is an array (required means at least 1 item)
  array_items?: unknown[]; // Validates each array item is in this list
  shapeOf?: ShapeOfValidation; // Validates object shape with custom validators
  arrayOfShapes?: ArrayOfShapesValidation; // Validates array of objects with shape validation
};

export type AttributeValueType<T extends keyof ValidationAttributes> =
  ValidationAttributes[T];

export type ValidationDescription = {
  [key: string]: ValidationAttributes;
};

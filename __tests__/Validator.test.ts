import Validator from './Validator';

describe('Validator', () => {
  const validator = new Validator();

  describe('validate_required', () => {
    it('should return an error if the field is required and value is missing', () => {
      const result = validator.validate_required('testField', '', true, {});
      expect(result).toEqual({
        field: 'testField',
        message: 'Missing required field',
      });
    });

    it('should return undefined if the field is required and value is present', () => {
      const result = validator.validate_required(
        'testField',
        'value',
        true,
        {},
      );
      expect(result).toBeUndefined();
    });
  });

  describe('validate_required_depends_on', () => {
    it('should return an error if dependent field matches and value is missing', () => {
      const input = {
        enable_structured_tasting_notes: '1',
        tasting_structured_temperature: '',
      };
      const result = validator.validate_required_depends_on(
        'tasting_structured_temperature',
        '',
        { key: 'enable_structured_tasting_notes', value: '1' },
        input,
      );
      expect(result).toEqual({
        field: 'tasting_structured_temperature',
        message: 'Missing required field',
      });
    });

    it('should return undefined if dependent field matches and value is present', () => {
      const input = {
        enable_structured_tasting_notes: '1',
        tasting_structured_temperature: '18_to_20_full_reds',
      };
      const result = validator.validate_required_depends_on(
        'tasting_structured_temperature',
        '18_to_20_full_reds',
        { key: 'enable_structured_tasting_notes', value: '1' },
        input,
      );
      expect(result).toBeUndefined();
    });

    it('should return undefined if dependent field does not match (field not required)', () => {
      const input = {
        enable_structured_tasting_notes: '0',
        tasting_structured_temperature: '',
      };
      const result = validator.validate_required_depends_on(
        'tasting_structured_temperature',
        '',
        { key: 'enable_structured_tasting_notes', value: '1' },
        input,
      );
      expect(result).toBeUndefined();
    });

    it('should return undefined if dependent field does not exist', () => {
      const input = {
        tasting_structured_temperature: '',
      };
      const result = validator.validate_required_depends_on(
        'tasting_structured_temperature',
        '',
        { key: 'enable_structured_tasting_notes', value: '1' },
        input,
      );
      expect(result).toBeUndefined();
    });

    it('should work with numeric values', () => {
      const input = {
        status_code: 200,
        description: '',
      };
      const result = validator.validate_required_depends_on(
        'description',
        '',
        { key: 'status_code', value: 200 },
        input,
      );
      expect(result).toEqual({
        field: 'description',
        message: 'Missing required field',
      });
    });

    it('should handle array fields when condition is met', () => {
      const input = {
        enable_structured_tasting_notes: '1',
        tasting_structured_nose_fruit: [],
        __fieldConfig: { array: true, array_items: ['apple', 'pear'] },
      };
      const result = validator.validate_required_depends_on(
        'tasting_structured_nose_fruit',
        [],
        { key: 'enable_structured_tasting_notes', value: '1' },
        input,
      );
      expect(result).toEqual({
        field: 'tasting_structured_nose_fruit',
        message: 'Missing required field',
      });
    });

    it('should allow non-empty arrays when condition is met', () => {
      const input = {
        enable_structured_tasting_notes: '1',
        tasting_structured_nose_fruit: ['apple', 'pear'],
        __fieldConfig: { array: true, array_items: ['apple', 'pear'] },
      };
      const result = validator.validate_required_depends_on(
        'tasting_structured_nose_fruit',
        ['apple', 'pear'],
        { key: 'enable_structured_tasting_notes', value: '1' },
        input,
      );
      expect(result).toBeUndefined();
    });

    it('should return undefined for options being undefined', () => {
      const input = {
        some_field: 'value',
      };
      const result = validator.validate_required_depends_on(
        'testField',
        '',
        undefined,
        input,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('validate_minLength', () => {
    it('should return an error if the value is shorter than the minimum length', () => {
      const result = validator.validate_minLength('testField', 'short', 10, {});
      expect(result).toEqual({
        field: 'testField',
        message: 'Field value is too short',
      });
    });

    it('should return undefined if the value meets the minimum length', () => {
      const result = validator.validate_minLength(
        'testField',
        'sufficient',
        5,
        {},
      );
      expect(result).toBeUndefined();
    });
  });

  describe('validate_maxLength', () => {
    it('should return an error if the value is longer than the maximum length', () => {
      const result = validator.validate_maxLength(
        'testField',
        'too long value',
        5,
        {},
      );
      expect(result).toEqual({
        field: 'testField',
        message: 'Field value is too long',
      });
    });

    it('should return undefined if the value meets the maximum length', () => {
      const result = validator.validate_maxLength('testField', 'short', 10, {});
      expect(result).toBeUndefined();
    });
  });

  describe('validate_regexp', () => {
    it('should return an error if the value does not match the regexp', () => {
      const result = validator.validate_regexp(
        'testField',
        '123',
        /^[a-z]+$/,
        {},
      );
      expect(result).toEqual({
        field: 'testField',
        message: "Field doesn't match the required pattern",
      });
    });

    it('should return undefined if the value matches the regexp', () => {
      const result = validator.validate_regexp(
        'testField',
        'abc',
        /^[a-z]+$/,
        {},
      );
      expect(result).toBeUndefined();
    });
  });

  describe('validate_equal', () => {
    it('should return an error if the value is not equal to the expected value', () => {
      const result = validator.validate_equal(
        'testField',
        'value',
        'expected',
        {},
      );
      expect(result).toEqual({
        field: 'testField',
        message: 'Field value is not equal to expected value',
      });
    });

    it('should return undefined if the value is equal to the expected value', () => {
      const result = validator.validate_equal(
        'testField',
        'expected',
        'expected',
        {},
      );
      expect(result).toBeUndefined();
    });
  });

  describe('validate_oneof', () => {
    it('should return an error if the value is not one of the expected values', () => {
      const result = validator.validate_oneof(
        'testField',
        'value',
        ['expected1', 'expected2'],
        {},
      );
      expect(result).toEqual({
        field: 'testField',
        message: 'Field value is not one of the expected values',
      });
    });

    it('should return undefined if the value is one of the expected values', () => {
      const result = validator.validate_oneof(
        'testField',
        'expected1',
        ['expected1', 'expected2'],
        {},
      );
      expect(result).toBeUndefined();
    });
  });

  describe('validate_shapeOf', () => {
    describe('basic object validation', () => {
      it('should return undefined for a valid object matching the shape', () => {
        const value = {
          code: '1234567890',
          type: 'EAN13',
        };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toBeUndefined();
      });

      it('should return error if value is not an object', () => {
        const result = validator.validate_shapeOf(
          'barcode',
          'not-an-object',
          {
            shape: { code: 'string' },
            required: ['code'],
          },
          {},
        );
        expect(result).toEqual({
          field: 'barcode',
          message: 'Field must be an object',
        });
      });

      it('should return error if value is an array', () => {
        const result = validator.validate_shapeOf(
          'barcode',
          ['item'],
          {
            shape: { code: 'string' },
            required: ['code'],
          },
          {},
        );
        expect(result).toEqual({
          field: 'barcode',
          message: 'Field must be an object',
        });
      });

      it('should return undefined if value is null (treated as empty)', () => {
        const result = validator.validate_shapeOf(
          'barcode',
          null,
          {
            shape: { code: 'string' },
            required: ['code'],
          },
          {},
        );
        // The function returns undefined for falsy values (!value check)
        expect(result).toBeUndefined();
      });

      it('should return undefined if value is undefined or falsy', () => {
        const result = validator.validate_shapeOf(
          'barcode',
          undefined,
          {
            shape: { code: 'string' },
            required: ['code'],
          },
          {},
        );
        expect(result).toBeUndefined();
      });
    });

    describe('required properties', () => {
      it('should return error if required property is missing', () => {
        const value = { type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toEqual({
          field: 'barcode',
          message: 'Missing required property: code',
        });
      });

      it('should return error if required property is undefined', () => {
        const value = { code: undefined, type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toEqual({
          field: 'barcode',
          message: 'Missing required property: code',
        });
      });

      it('should return error if required property is null', () => {
        const value = { code: null, type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toEqual({
          field: 'barcode',
          message: 'Missing required property: code',
        });
      });

      it('should return error if required property is empty string', () => {
        const value = { code: '', type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toEqual({
          field: 'barcode',
          message: 'Missing required property: code',
        });
      });

      it('should allow optional properties to be missing', () => {
        const value = { code: '1234567890', type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
            normalized_gtin: 'string',
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toBeUndefined();
      });
    });

    describe('type validation', () => {
      it('should validate string type correctly', () => {
        const value = { code: 123, type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toEqual({
          field: 'barcode',
          message: 'Property "code" must be of type string, got number',
        });
      });

      it('should validate number type correctly', () => {
        const value = { age: '30', name: 'John' };
        const options = {
          shape: {
            age: 'number',
            name: 'string',
          },
          required: ['age'],
        };
        const result = validator.validate_shapeOf('person', value, options, {});
        expect(result).toEqual({
          field: 'person',
          message: 'Property "age" must be of type number, got string',
        });
      });

      it('should validate boolean type correctly', () => {
        const value = { active: 'true', name: 'John' };
        const options = {
          shape: {
            active: 'boolean',
            name: 'string',
          },
          required: ['active'],
        };
        const result = validator.validate_shapeOf('user', value, options, {});
        expect(result).toEqual({
          field: 'user',
          message: 'Property "active" must be of type boolean, got string',
        });
      });

      it('should allow correct types to pass', () => {
        const value = {
          code: '1234567890',
          count: 42,
          active: true,
        };
        const options = {
          shape: {
            code: 'string',
            count: 'number',
            active: 'boolean',
          },
          required: ['code', 'count', 'active'],
        };
        const result = validator.validate_shapeOf('data', value, options, {});
        expect(result).toBeUndefined();
      });
    });

    describe('enum validation (array of allowed values)', () => {
      it('should validate enum values correctly', () => {
        const value = { code: '1234567890', type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: ['EAN8', 'EAN13', 'UPC', 'GTIN14', 'unknown'],
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toBeUndefined();
      });

      it('should return error if value is not in enum', () => {
        const value = { code: '1234567890', type: 'INVALID' };
        const options = {
          shape: {
            code: 'string',
            type: ['EAN8', 'EAN13', 'UPC', 'GTIN14', 'unknown'],
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toEqual({
          field: 'barcode',
          message:
            'Property "type" must be one of: EAN8, EAN13, UPC, GTIN14, unknown',
        });
      });
    });

    describe('custom validators', () => {
      it('should run custom validator and pass when valid', () => {
        const mockValidator = (value: unknown) => {
          const str = value as string;
          return str.length >= 8 && str.length <= 14;
        };
        const value = { code: '1234567890', type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          validators: {
            code: mockValidator,
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toBeUndefined();
      });

      it('should return error when custom validator returns false', () => {
        const mockValidator = (value: unknown) => {
          const str = value as string;
          return str.length >= 8 && str.length <= 14;
        };
        const value = { code: '123', type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          validators: {
            code: mockValidator,
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toEqual({
          field: 'barcode.code',
          message: 'Property "code" failed custom validation',
        });
      });

      it('should handle custom validator errors', () => {
        const mockValidator = () => {
          throw new Error('Invalid barcode format');
        };
        const value = { code: '1234567890', type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          validators: {
            code: mockValidator,
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toEqual({
          field: 'barcode.code',
          message: 'Property "code" validation error: Invalid barcode format',
        });
      });

      it('should skip custom validator for optional properties that are not present', () => {
        const mockValidator = () => false; // Would fail if called
        const value = { code: '1234567890', type: 'EAN13' };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
            normalized_gtin: 'string',
          },
          validators: {
            normalized_gtin: mockValidator,
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toBeUndefined();
      });
    });

    describe('real-world barcode example', () => {
      it('should validate a complete barcode object', () => {
        const value = {
          code: '5901234123457',
          type: 'EAN13',
          normalized_gtin: '05901234123457',
        };
        const isValidBarcode = (code: unknown) => {
          const str = code as string;
          return /^\d{8,14}$/.test(str);
        };
        const options = {
          shape: {
            code: 'string',
            type: ['EAN8', 'EAN13', 'UPC', 'GTIN14', 'unknown'],
            normalized_gtin: 'string',
          },
          validators: {
            code: isValidBarcode,
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toBeUndefined();
      });

      it('should reject invalid barcode', () => {
        const value = {
          code: 'INVALID',
          type: 'EAN13',
        };
        const isValidBarcode = (code: unknown) => {
          const str = code as string;
          return /^\d{8,14}$/.test(str);
        };
        const options = {
          shape: {
            code: 'string',
            type: ['EAN8', 'EAN13', 'UPC', 'GTIN14', 'unknown'],
            normalized_gtin: 'string',
          },
          validators: {
            code: isValidBarcode,
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toEqual({
          field: 'barcode.code',
          message: 'Property "code" failed custom validation',
        });
      });
    });

    describe('edge cases', () => {
      it('should return undefined if options is undefined', () => {
        const value = { code: '123' };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          undefined,
          {},
        );
        expect(result).toBeUndefined();
      });

      it('should handle empty shape object', () => {
        const value = { code: '123', type: 'EAN13' };
        const options = {
          shape: {},
          required: [],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toBeUndefined();
      });

      it('should handle object with extra properties not in shape', () => {
        const value = {
          code: '1234567890',
          type: 'EAN13',
          extra_field: 'should be ignored',
        };
        const options = {
          shape: {
            code: 'string',
            type: 'string',
          },
          required: ['code', 'type'],
        };
        const result = validator.validate_shapeOf(
          'barcode',
          value,
          options,
          {},
        );
        expect(result).toBeUndefined();
      });
    });
  });

  describe('validate_at_least_one_of', () => {
    describe('basic validation', () => {
      it('should return error when none of the fields have a value', () => {
        const input = {
          field1: '',
          field2: null,
          field3: undefined,
          field4: [],
        };
        const options = {
          fields: ['field1', 'field2', 'field3', 'field4'],
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          '',
          options,
          input,
        );
        expect(result).toEqual({
          field: 'field1',
          message: 'At least one must be selected',
        });
      });

      it('should return undefined when at least one field has a string value', () => {
        const input = {
          field1: 'value',
          field2: '',
          field3: undefined,
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          'value',
          options,
          input,
        );
        expect(result).toBeUndefined();
      });

      it('should return undefined when at least one field has a non-empty array', () => {
        const input = {
          field1: [],
          field2: ['item'],
          field3: undefined,
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          [],
          options,
          input,
        );
        expect(result).toBeUndefined();
      });

      it('should return error when all arrays are empty', () => {
        const input = {
          field1: [],
          field2: [],
          field3: [],
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          [],
          options,
          input,
        );
        expect(result).toEqual({
          field: 'field1',
          message: 'At least one must be selected',
        });
      });

      it('should return undefined when any field has a number value', () => {
        const input = {
          field1: '',
          field2: 0,
          field3: undefined,
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
        };
        const result = validator.validate_at_least_one_of(
          'field2',
          0,
          options,
          input,
        );
        expect(result).toBeUndefined();
      });
    });

    describe('conditional validation with required_depends_on', () => {
      it('should validate when condition is met and no fields have values', () => {
        const input = {
          enable_feature: '1',
          field1: '',
          field2: '',
          field3: '',
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
          required_depends_on: { key: 'enable_feature', value: '1' },
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          '',
          options,
          input,
        );
        expect(result).toEqual({
          field: 'field1',
          message: 'At least one must be selected',
        });
      });

      it('should pass when condition is met and at least one field has value', () => {
        const input = {
          enable_feature: '1',
          field1: 'value',
          field2: '',
          field3: '',
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
          required_depends_on: { key: 'enable_feature', value: '1' },
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          'value',
          options,
          input,
        );
        expect(result).toBeUndefined();
      });

      it('should skip validation when condition is not met', () => {
        const input = {
          enable_feature: '0',
          field1: '',
          field2: '',
          field3: '',
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
          required_depends_on: { key: 'enable_feature', value: '1' },
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          '',
          options,
          input,
        );
        expect(result).toBeUndefined();
      });

      it('should skip validation when dependent field does not exist', () => {
        const input = {
          field1: '',
          field2: '',
          field3: '',
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
          required_depends_on: { key: 'enable_feature', value: '1' },
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          '',
          options,
          input,
        );
        expect(result).toBeUndefined();
      });

      it('should work with numeric values in condition', () => {
        const input = {
          enable_feature: 1,
          field1: '',
          field2: '',
        };
        const options = {
          fields: ['field1', 'field2'],
          required_depends_on: { key: 'enable_feature', value: 1 },
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          '',
          options,
          input,
        );
        expect(result).toEqual({
          field: 'field1',
          message: 'At least one must be selected',
        });
      });
    });

    describe('real-world examples', () => {
      it('should require at least one contact method', () => {
        const input = {
          contact_email: '',
          contact_phone: '',
          contact_address: '',
        };
        const options = {
          fields: ['contact_email', 'contact_phone', 'contact_address'],
        };
        const result = validator.validate_at_least_one_of(
          'contact_email',
          '',
          options,
          input,
        );
        expect(result).toEqual({
          field: 'contact_email',
          message: 'At least one must be selected',
        });
      });

      it('should pass when at least one contact method provided', () => {
        const input = {
          contact_email: 'user@example.com',
          contact_phone: '',
          contact_address: '',
        };
        const options = {
          fields: ['contact_email', 'contact_phone', 'contact_address'],
        };
        const result = validator.validate_at_least_one_of(
          'contact_email',
          'user@example.com',
          options,
          input,
        );
        expect(result).toBeUndefined();
      });

      it('should require at least one social media when enabled', () => {
        const input = {
          has_social: 'yes',
          social_facebook: '',
          social_twitter: '',
          social_instagram: '',
        };
        const options = {
          fields: ['social_facebook', 'social_twitter', 'social_instagram'],
          required_depends_on: { key: 'has_social', value: 'yes' },
        };
        const result = validator.validate_at_least_one_of(
          'social_facebook',
          '',
          options,
          input,
        );
        expect(result).toEqual({
          field: 'social_facebook',
          message: 'At least one must be selected',
        });
      });

      it('should not require social media when disabled', () => {
        const input = {
          has_social: 'no',
          social_facebook: '',
          social_twitter: '',
          social_instagram: '',
        };
        const options = {
          fields: ['social_facebook', 'social_twitter', 'social_instagram'],
          required_depends_on: { key: 'has_social', value: 'yes' },
        };
        const result = validator.validate_at_least_one_of(
          'social_facebook',
          '',
          options,
          input,
        );
        expect(result).toBeUndefined();
      });
    });

    describe('edge cases', () => {
      it('should return undefined if options is undefined', () => {
        const result = validator.validate_at_least_one_of(
          'field1',
          '',
          undefined,
          {},
        );
        expect(result).toBeUndefined();
      });

      it('should handle fields not present in input', () => {
        const input = {
          field1: '',
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          '',
          options,
          input,
        );
        expect(result).toEqual({
          field: 'field1',
          message: 'At least one must be selected',
        });
      });

      it('should treat boolean false as a valid value', () => {
        const input = {
          field1: false,
          field2: '',
          field3: '',
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          false,
          options,
          input,
        );
        expect(result).toBeUndefined();
      });

      it('should treat number 0 as a valid value', () => {
        const input = {
          field1: 0,
          field2: '',
          field3: '',
        };
        const options = {
          fields: ['field1', 'field2', 'field3'],
        };
        const result = validator.validate_at_least_one_of(
          'field1',
          0,
          options,
          input,
        );
        expect(result).toBeUndefined();
      });
    });
  });
});

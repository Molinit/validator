import Validator from './Validator';
import {
  PrimitiveValue,
  ValidationAttributes,
  ValidationDescription,
  ValidationError,
  ValidationInput,
} from './types';

const validate = (
  input: ValidationInput,
  fieldDescription: ValidationDescription,
): ValidationError[] => {
  const validator = new Validator();
  const keys = Object.keys(fieldDescription);

  const errors = keys
    .map((attr) => {
      return Object.keys(fieldDescription[attr])
        .map((ruleName) => {
          const fn = `validate_${ruleName}` as keyof Validator;
          if (typeof validator[fn] === 'function') {
            // Pass both input data and field configuration
            const validationContext = {
              ...input,
              __fieldConfig: fieldDescription[attr],
            };
            return validator[fn](
              attr,
              input[attr] as PrimitiveValue,
              fieldDescription[attr][
                ruleName as keyof ValidationAttributes
              ] as never, // This is a hack to make TS happy
              validationContext,
            );
          }
        })
        .filter((item) => item);
    })
    .filter((item) => item.length) as unknown as ValidationError[];

  return errors.flat();
};

export default validate;

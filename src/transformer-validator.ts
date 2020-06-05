import { plainToClass, ClassTransformOptions } from 'class-transformer';
import { validate, validateSync, ValidatorOptions, ValidationError } from 'class-validator';
import { ClassType } from 'class-transformer/ClassTransformer';

import { getObjectKeys, isObjectKey } from './utils';

export type TransformValidationOptions = {
  validator?: ValidatorOptions;
  transformer?: ClassTransformOptions;
};

export function isValidationErrors(errors: any): errors is ValidationError[] {
  if (Array.isArray(errors)) {
    return errors.every(isValidationErrors);
  }

  return ValidationError.prototype.isPrototypeOf(errors);
}

export function transform<T, P>(classType: ClassType<T>, plain: P) {
  const classTypeInstance = new classType();
  return getObjectKeys(classTypeInstance).reduce((properties, key) => {
    if (isObjectKey(plain, key)) {
      Object.assign(properties, { [key]: plain[key] });
    }
    return properties;
  }, {} as T);
}

export function transformAndValidate<T, P>(
  classType: ClassType<T>,
  plain: P,
  options: TransformValidationOptions = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transformed = plainToClass(classType, transform(classType, plain), options.transformer);
    validate(transformed, options.validator)
      .then((errors) => {
        if (errors && errors.length) reject(errors);
        resolve(transformed);
      })
      .catch(reject);
  });
}

export function transformAndValidateSync<T, P>(
  classType: ClassType<T>,
  plain: P,
  options: TransformValidationOptions = {},
) {
  const transformed = plainToClass(classType, transform(classType, plain), options.transformer);
  const errors = validateSync(transformed, options.validator);
  if (errors && errors.length) {
    throw errors;
  }
  return transformed;
}

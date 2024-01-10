import { snakeToCamel } from '../../../common';

const isPlainObject = (input: unknown): boolean =>
  input === Object(input) && !Array.isArray(input);

const convertObjectKeys = <T extends object, R extends object>(
  obj: T,
  converter: (objectKey: string) => string
): R => {
  const recurse = <T1 extends object, R1 extends object>(
    input: T1
  ): T1 | R1 => {
    if (isPlainObject(input)) {
      return Object.keys(input).reduce(
        (acc, key) =>
          Object.assign(acc, {
            [converter(key)]: recurse(input[key]),
          }),
        {} as R1
      );
    } else if (Array.isArray(input)) {
      return input.map((i) => recurse(i)) as R1;
    }
    return input as T1;
  };

  return recurse(obj) as R;
};

export const mapResponseToCamelCase = <T extends object, R extends object>(
  obj: T
): R => convertObjectKeys(obj, snakeToCamel);

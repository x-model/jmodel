export const WATCHERS = Symbol('watchers');

export function createNestedModel(model: any, source: any) {
  // return structuredClone(model);
  if (
    model &&
    typeof model === 'object' &&
    ['Array', 'Object'].includes(model.constructor.name)
  ) {
    const keys = Object.keys(model);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let value = model[key];

      if (
        value &&
        typeof value === 'object' &&
        ['Array', 'Object'].includes(value.constructor.name)
      ) {
        const childValue = {};

        value = createNestedModel(value, childValue);
      }

      Object.defineProperty(source, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    return source;
  } else {
    return model;
  }
}

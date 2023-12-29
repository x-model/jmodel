export const WATCHERS = Symbol('watchers');

export function createNestedModel(
  model: any,
  source: any,
  watchers: {
    [WATCHERS]: Map<string, any>;
  }

  // facade: {}
) {
  if (
    model &&
    typeof model === 'object' &&
    ['Array', 'Object'].includes(model.constructor.name)
  ) {
    const keys = Object.keys(model);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let value = model[key];
      // value = address

      if (
        value &&
        typeof value === 'object' &&
        ['Array', 'Object'].includes(value.constructor.name)
      ) {
        // const tmpVal = {
        //   [WATCHERS]: new Map<string, any>([]),
        // };

        const childWatchers = {
          [WATCHERS]: new Map<string, any>([]),
        };
        watchers[key] = childWatchers;
        const childValue = {};

        value = createNestedModel(value, childValue, childWatchers);
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

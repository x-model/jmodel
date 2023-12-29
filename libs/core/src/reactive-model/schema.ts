export const PATH = Symbol('path');

export type SchemaMember<T> = {
  type: T;
  path: string;
};

export function createSchema<T>(initialModel: T) {
  const [result, props, parents] = createSchemaModel(initialModel);

  const getPath = <R>(pathSelector: (model: T) => R) => {
    const value = pathSelector(result as any);
    let key;

    if (
      value &&
      typeof value === 'object' &&
      ['Array', 'Object'].includes(value.constructor.name)
    ) {
      key = value[PATH] + '';
    } else {
      key = value;
    }

    const pathKeys = key.split('|');
    let path = [];

    if (pathKeys.length === 1) {
      path = generatePath(pathKeys, props, parents);
    } else {
      path = generatePath(pathKeys[1], props, parents);
      const propName = props[+pathKeys[0]];
      path.push(propName);
    }

    return { path: path.join('.') } as SchemaMember<R>;
  };

  return { path: getPath };
}

function generatePath(parentId: string, props, parents) {
  let paths = [];

  if (parentId != null && +parentId >= 0) {
    const map = parents[+parentId];
    const [propIndex, parentIndex] = map.split('|');
    const propName = props[+propIndex];
    paths = [...generatePath(parentIndex, props, parents), propName];
  }

  return paths;
}

const sch = {
  id: 2, // [4, 1]
  firstName: 3, // [6, 1]
  address: {
    [PATH]: 4,
    state: {
      [PATH]: 5,
      id: 7, // [4, 5]
      name: 8, // [5, 5]
    },
    street: 6, // [8, 4]
  },
};

const obj = {
  1: 'root',
  2: 'address',
  3: 'state',
  4: 'id',
  5: 'name',
  6: 'firstName',
  7: 'lastName',
  8: 'street',
};

// albo te zresolverować?
const fields = {
  5: '3|4', // root.address.state
  4: '2|1', // root.address
  1: '1|0', // root
};

// przy tworzeniu robimy set(key, number) i potem tą listę konwertujemy do obiektu { number: key }

// zapamiętuje zresolverowane?

function createSchemaModel(model) {
  const pathId = 0;
  const result = {
    [PATH]: pathId,
  };

  const props = ['root'];
  const parents = ['0'];

  createChildSchemaModel(model, result, props, parents, pathId);

  return [result, props, parents];
}

function createChildSchemaModel(
  model: any,
  result: any,
  props: string[],
  parents: string[],
  parentId: number
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
      let keyId;

      if (props.includes(key)) {
        keyId = props.findIndex((item) => item === key);
      } else {
        keyId = props.length;
        props.push(key);
      }

      if (
        value &&
        typeof value === 'object' &&
        ['Array', 'Object'].includes(value.constructor.name)
      ) {
        const childId = parents.length;
        const parent = `${keyId}|${parentId}`;

        if (parents.includes(parent)) {
          parents.findIndex((item) => item === parent);
        } else {
          parents.push(parent);
        }

        const childModel = {
          [PATH]: childId,
        };

        value = createChildSchemaModel(
          value,
          childModel,
          props,
          parents,
          childId
        );
      } else {
        value = `${keyId}|${parentId}`;
      }

      Object.defineProperty(result, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    return result;
  } else {
    return model;
  }
}

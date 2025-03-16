import {
  _,
  FIELD,
  FIELD_CONFIG,
  INITIAL_VALUE,
  PATH,
  SCHEMA,
  SCHEMA_FIELD,
} from './types';

export function buildGraph(schema) {
  const pathIndex = 0;
  const model = {
    [PATH]: pathIndex,
  };

  const parents = [undefined]; // Root has no parent
  const parentProps = { 0: undefined }; // Root has no parent
  const props = new Set();
  const fieldsConfigs = [];
  const parsedModel = parseModel(schema);
  const isFieldModel = isField(parsedModel);
  const value = isFieldModel ? parsedModel.value : parsedModel;
  const config = isFieldModel ? parsedModel.config : undefined;

  if (config) {
    fieldsConfigs.push(getFieldConfig(undefined, config));
  }

  if (value != null && typeof value === 'object') {
    processSchema(
      value,
      model,
      parents,
      parentProps,
      props,
      fieldsConfigs,
      pathIndex
    );
  }

  return {
    graph: model,
    parents,
    parentProps,
    props: [...props],
    fieldsConfigs,
  };
}

export function processSchema(
  schema,
  model,
  parents,
  parentProps,
  props,
  fieldsConfigs,
  parentIndex
) {
  let currentIndex = 1;
  let propIndex = 0;

  for (const key in schema) {
    const parsedModel = parseModel(schema[key]);
    const isFieldModel = isField(parsedModel);
    const value = isFieldModel ? parsedModel.value : parsedModel;
    const config = isFieldModel ? parsedModel.config : undefined;

    if (!props.has(key)) {
      props.add(key);
      propIndex = props.size - 1;
    } else {
      propIndex = [...props.values()].findIndex((propName) => propName === key);
    }

    if (typeof value === 'object') {
      const newParentIndex = parents.length;
      parents[newParentIndex] = parentIndex;
      parentProps[newParentIndex] = propIndex;

      if (config) {
        fieldsConfigs.push(getFieldConfig(`${newParentIndex}`, config));
      }

      if (Array.isArray(value)) {
        const schemaModel = {};

        if (typeof value[0] === 'object') {
          // TODO handle array with different types
          processSchema(
            value[0],
            schemaModel,
            parents,
            parentProps,
            props,
            fieldsConfigs,
            newParentIndex
          );

          // check for nested arrays
          const childModel = {
            [PATH]: newParentIndex,
            [SCHEMA]: schemaModel,
          };

          model[key] = createArrayProxy(newParentIndex, childModel);
        } else {
          // check for nested arrays
          const childModel = {
            [PATH]: newParentIndex,
            [SCHEMA]: schemaModel, // TODO Verify is it correct model
          };

          model[key] = createArrayProxy(newParentIndex, childModel);
        }
      } else {
        const childModel = {};
        childModel[PATH] = newParentIndex;
        model[key] = childModel;
        processSchema(
          value,
          childModel,
          parents,
          parentProps,
          props,
          fieldsConfigs,
          newParentIndex
        );
      }
    } else {
      const schemaKey = `${propIndex}|${parentIndex}`;
      model[key] = schemaKey;

      if (config) {
        fieldsConfigs.push(getFieldConfig(schemaKey, config));
      }
    }

    currentIndex++;
  }

  return currentIndex;
}

function parseModel(model): any {
  if (
    model &&
    typeof model === 'object' &&
    Reflect.ownKeys(model).includes(FIELD)
  ) {
    return {
      [FIELD]: true,
      value: model[INITIAL_VALUE],
      config: model[FIELD_CONFIG],
    };
  }

  if (
    model &&
    typeof model === 'object' &&
    Reflect.ownKeys(model).includes(SCHEMA_FIELD)
  ) {
    return {
      [FIELD]: true,
      value: model[SCHEMA_FIELD],
      config: model[FIELD_CONFIG],
    };
  }

  return model;
}

function getFieldConfig(
  keyId: string,
  config: any
): { key: string; config: any } {
  return {
    key: keyId,
    config: { ...config },
  };
}

function isField(model): boolean {
  return (
    model && typeof model === 'object' && Reflect.ownKeys(model).includes(FIELD)
  );
}

function createArrayProxy(path: number, arrayModel: any) {
  return new Proxy(arrayModel, {
    get(target, prop: string) {
      if (isNaN(+prop)) {
        throw new Error('Numeric index required');
      }

      return {
        [PATH]: [path, +prop],
        ...target[SCHEMA],
      };
    },
  });
}

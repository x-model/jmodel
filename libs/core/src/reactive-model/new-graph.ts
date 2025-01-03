import {
  _,
  FIELD,
  FIELD_CONFIG,
  INITIAL_VALUE,
  PATH,
  SCHEMA,
  SCHEMA_FIELD,
} from './model-utils';

// Model example

export const model = {
  player1: {
    currentEquipment: {
      sword: '',
      additionalEq: {
        sword: '',
      },
    },
    bags: [{ sword: '', children: [{ names: '' }] }],
    score: '',
  },
  player2: {
    currentEquipment: {
      sword: '',
    },
    bags: [{ sword: '' }, { sword: '' }],
    score: '',
  },
  names: ['uno', 'duo'],
};

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

// primitive value
// array with objects
// array with primitives ex. [1, 2, 3]
// object
// field
// schema
// object with fields
// object with schemas
// object with primitive arrays
// object with object arrays
// export function getRawSchema(model): any {
//   if (!model) {
//     return _;
//   }

//   let parsedModel = parseModel(model);

//   if (parsedModel == null || typeof parsedModel !== "object") {
//     return _;
//   }

//   let schema;

//   if (typeof parsedModel === "object") {
//     if (Array.isArray(parsedModel)) {
//       return [getRawSchema(parsedModel[0])];
//     } else {
//       schema = {};

//       for (let key in parsedModel) {
//         const value = parsedModel[key];
//         schema[key] = getRawSchema(value);
//       }
//     }
//   }

//   return schema;
// }

// function parseModel(model): any {
//   if (
//     model &&
//     typeof model === "object" &&
//     Reflect.ownKeys(model).includes(FIELD)
//   ) {
//     return model[INITIAL_VALUE];
//   }

//   if (
//     model &&
//     typeof model === "object" &&
//     Reflect.ownKeys(model).includes(SCHEMA_FIELD)
//   ) {
//     return model[SCHEMA_FIELD];
//   }

//   return model;
// }

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

// Build the props and parents from the model
// buildPropsAndParents(model);

// Function to get the path of a given value (dot notation)
// function getPath(value) {
//   const pathParts = [];
//   let currentValue = value;
//   let isArrayItem = false;

//   // While we have a valid value
//   while (currentValue !== undefined) {
//     const [childIndex, parentIndex] = currentValue.split("|").map(Number);

//     // Get the name of the property based on the child index
//     let propName = props[childIndex];

//     // Check if we're dealing with an array item (like bags[0], bags[1])
//     if (isArrayItem) {
//       // Append the index in brackets if it is an array item
//       propName += `[${parentIndex}]`;
//     }

//     // Add the property name to the path
//     pathParts.unshift(propName);

//     // Move to the parent
//     currentValue =
//       parents[parentIndex] !== undefined
//         ? `${parentIndex}|${parents[parentIndex]}`
//         : undefined;

//     // Check if we are handling an array element (this ensures that "bags" will be added as "bags[0]", "bags[1]", etc.)
//     if (Array.isArray(value) && !isArrayItem) {
//       isArrayItem = true;
//     }
//   }

//   // Return the path in dot notation
//   return pathParts.join(".");
// }

// Example usage:

// console.log(getPath(model.player1.currentEquipment.sword)); // "player1.currentEquipment.sword"
// console.log(getPath(model.player1.bags[0].sword)); // "player1.bags[0].sword"
// console.log(getPath(model.player1.score)); // "player1.score"

// Display props and parents
// console.log("Props Table:", props); // Display the props table
// console.log("Parents Mapping:", parents); // Display the parents mapping

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

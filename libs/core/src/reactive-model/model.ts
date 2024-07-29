import { FROM_SCHEMA, SIGNAL, SIGNAL_VALUE } from './graph';

// export const cardModel = {
//   player1: rSignal({
//     score: 0,
//     isLoading: rSignal(false),
//     win: false,
//   }),
//   player2: rSignal({
//     score: 0,
//     isLoading: rSignal(false),
//     win: false,
//   }),
//   person: {
//     name: 'WK',
//     address: {
//       street: '',
//     },
//   },
// };

export function createModel<T>(model: T): T {
  if (typeof model !== 'object') {
    throw new Error('Model is not an object');
  }

  let modelCopy = {};

  // TODO handle null - null is also object
  if (typeof model === 'object' && Reflect.ownKeys(model).includes(SIGNAL)) {
    const valueKey =
      model[SIGNAL_VALUE] === FROM_SCHEMA ? SIGNAL : SIGNAL_VALUE;

    // TODO handle null - null is also object
    if (typeof model[valueKey] === 'object') {
      modelCopy = createModel(model[valueKey]);
    } else {
      return model[valueKey];
    }
  }
  // TODO handle null - null is also object
  if (typeof model === 'object' && Array.isArray(model)) {
    modelCopy = structuredClone(model);
  }

  Object.keys(model).map((key) => {
    if (typeof model[key] === 'object') {
      modelCopy[key] = createModel(model[key]);
    } else {
      modelCopy[key] = model[key];
    }
  });

  return modelCopy as T;
}

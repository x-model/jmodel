import { Query, VALIDATORS, createGraph2 } from './graph';
import { TARGET, createGraph } from './graph';
import { createModel } from './model';

const SOURCE = Symbol('SOURCE');
const WATCHERS = Symbol('WATCHERS');
const STATE = Symbol('STATE');
const TRACKED = Symbol('TRACKED');
const CALLBACK = Symbol('CALLBACK');
const QUERY = Symbol('QUERY');
const PATH = Symbol('PATH');
const META_DATA = Symbol('META_DATA');
const MODEL_REF = Symbol('MODEL_REF');
const DISABLED = Symbol('DISABLED');
const FIRST_CHANGE = Symbol('FIRST_CHANGE');

export interface ReactiveModel<T> {
  signals?: any;
  graph?: any;
  [SOURCE]: Source<T>;
  get: <Value>(query?: Query<T, Value>) => Value | T;
  set: <Value, R>(query: Query<T, Value>, fn: (value: Value) => R) => void;
  watch<Value>(
    query: Query<T, Value>,
    connect: () => (value: Value) => void
  ): () => void;
  destroy: () => void;
}

type Source<T> = {
  [STATE]: T;
  [WATCHERS]: Map<symbol, any>;
  [TRACKED]: [string, symbol][];
};

export function createReactiveModel<T>(model: T): ReactiveModel<T> {
  const source: Source<T> = {
    [STATE]: createModel(model),
    [WATCHERS]: new Map<symbol, any>([]),
    [TRACKED]: [],
  };

  const reactiveModel = {
    signals: null,
    graph: null,
    [SOURCE]: source,
    // TODO Poprawić get, bo teraz jest problem z typem jak używamy get, jest lub i nie wie co przypisać do pola
    get: function <Value>(query?: Query<T, Value>): Value | T {
      return query ? query(source[STATE]) : source[STATE];
    },
    set: function <Value, R>(
      query: Query<T, Value>,
      fn: (value: Value) => R
    ): void {
      const target = query[TARGET][0];
      const pathSegments = !!target ? target.split('.') : [];
      const newModel = fn(query(source[STATE]));
      const changes = checkChanges(source, newModel, pathSegments);

      if (!!target) {
        let lastSegment = pathSegments[pathSegments.length - 1];
        let parent = source[STATE];

        for (let i = 0; i < pathSegments.length - 1; i++) {
          parent = parent[pathSegments[i]];
        }

        parent[lastSegment] = newModel;
      } else {
        source[STATE] = newModel as any;
      }

      // runValidators(reactiveModel);

      // przed dodaniem sprawdza czy już nie zostało dodane wcześniej i nie skonsumowane
      const filteredChanges = new Set(changes);
      const watchIds = [];

      source[TRACKED].forEach((tracked) => {
        if (watchIds.includes(tracked[1])) {
          return;
        }

        if (filteredChanges.has(tracked[0])) {
          watchIds.push(tracked[1]);
        }
      });

      watchIds.forEach((watchId) => {
        const watchFn = source[WATCHERS].get(watchId);
        watchFn();
      });
    },

    watch: function <Value>(
      query: Query<T, Value>,
      connect: () => (value: Value) => void
    ): () => void {
      const watchId = Symbol('watchId');
      query[TARGET].forEach((path: string) => {
        source[TRACKED].push([path, watchId]);
      });

      const watcherFn = connect();
      const watchFn = () => watcherFn(query(source[STATE]));
      source[WATCHERS].set(watchId, watchFn);

      console.log('watcher registered');

      return unwatch(watchId, source);
    },

    destroy: function (): void {
      source[STATE] = null;
      source[TRACKED] = [];
      source[WATCHERS].clear();
    },
  };

  reactiveModel.graph = createModelGraph(model);
  reactiveModel.signals = createSignals(reactiveModel);

  console.log(reactiveModel);
  return reactiveModel;
}

const runValidators = (reactiveModel) => {
  Object.keys(reactiveModel.signals).forEach((key) => {
    (reactiveModel.signals[key][META_DATA].data[VALIDATORS] || []).forEach(
      (validator) =>
        validator(reactiveModel.signals[key].value, reactiveModel.get())
    );
  });
};

export const isValid = (model) => {
  if (model?.$errors) {
    return false;
  }

  let valid = true;
  const params = Object.keys(model).filter((key) => !key.startsWith('$'));

  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    valid = valid && isValid(model[param]);

    if (!valid) break;
  }

  return valid;
};

export const disable = (signal) => {
  signal[DISABLED] = true;
};

export const isDisabled = (signal) => {
  return !!signal[DISABLED];
};

export const isFirstChange = (signal) => {
  return !!signal[FIRST_CHANGE];
};

export const enable = (signal) => {
  signal[DISABLED] = false;
};

const createModelGraph = <T>(model: T) => {
  const graph = createGraph2(model);
  return graph;
};

export const computed = (
  model,
  signal1,
  signal2,
  callback: (result: any) => any
) => {
  const path1 = signal1[PATH];
  const path2 = signal2[PATH];
  const query = model.graph.queryFromPaths(path1, path2, callback);

  const signalFn = (callback: (value) => void) => {
    model.watch(query, () => callback);
  };

  const signal = {
    $: signalFn,
  };

  signal[QUERY] = query;
  signal[PATH] = query[TARGET];

  Object.defineProperty(signal, '$value', {
    get: function () {
      return model.get(query);
    },
  });

  return signal;
};

const createSignals = <T>(reactiveModel: ReactiveModel<T>) => {
  const signals = reactiveModel.graph.signals.reduce((prev, next) => {
    const key: string = reactiveModel.graph.getPathByKey(next.key)?.path;
    const signal = createSignal(
      next,
      reactiveModel.graph.queryFromPath(next.key),
      reactiveModel.graph.getPathByKey(next.key)?.path,
      reactiveModel
    );

    const params = key.split('.');

    if (params.length === 1) {
      return { ...prev, [params[0]]: signal };
    }

    let obj = prev;
    let lastParam;

    params.forEach((param, index) => {
      lastParam = param;

      if (params.length === index + 1) {
        return;
      }

      if (!obj.hasOwnProperty(param)) {
        obj[param] = {};
      }
      obj = obj[param];
    });

    obj[lastParam] = signal;

    return prev;
  }, {});
  return signals;
};

const createSignal = (signalDef, query, path, reactiveModel) => {
  const signalFn = (callback: (value) => void) => {
    reactiveModel.watch(query, () => callback);
  };

  const signal = {
    $: signalFn,
  };

  signal[MODEL_REF] = reactiveModel;
  signal[META_DATA] = signalDef;
  signal[QUERY] = query;
  signal[PATH] = path;
  signal[FIRST_CHANGE] = false;

  Object.defineProperty(signal, '$value', {
    set: function (value) {
      if (!signal[DISABLED]) {
        reactiveModel.set(query, (state) => value);
        signal[FIRST_CHANGE] = true;
      }
    },
    get: function () {
      if (signal[DISABLED]) {
        return undefined;
      }
      return reactiveModel.get(query);
    },
  });

  Object.defineProperty(signal, '$errors', {
    get: function () {
      if (signal[DISABLED]) {
        return undefined;
      }

      const errors = (signalDef.data[VALIDATORS] || []).reduce(
        (errors, validator) => {
          return {
            ...errors,
            ...validator(reactiveModel.get(query), reactiveModel.get()),
          };
        },
        {}
      );

      return !errors || Object.keys(errors).length === 0 ? undefined : errors;
    },
  });

  return signal;
};

const createSelectors = (model) => {};

function unwatch<T>(watchId: symbol, source: Source<T>): () => void {
  return () => {
    source[TRACKED] = source[TRACKED].filter((item) => item[1] !== watchId);
    source[WATCHERS].delete(watchId);
    console.log('unwatched');
  };
}

function getByPath(source, pathSegments: string[]) {
  let value = source;
  for (let i = 0; i < pathSegments.length; i++) {
    value = value[pathSegments[i]];

    if (value == null) {
      break;
    }
  }

  return value;
}

// co jak ktoś w modelu będzie miał więcej pól niż w source?
function checkChanges<State, Model>(
  source: Source<State>,
  model: Model,
  pathSegments: string[]
): string[] {
  // mozna sprawdzać referencje, jeżeli są takie same modelu i source to wtedy wgl nie wykonujemy metodki,
  // jak nie będziemy zmieniać referencji to będziemy musieli skanować potem cały model
  const value = getByPath(source[STATE], pathSegments);
  let changes: string[] = [];
  let tracked = source[TRACKED];

  // TODO handle null - null is also object
  if (model && typeof model === 'object') {
    // jak zrobić watch na modelu? całym?
    if (value != model) {
      const watchersKey = pathSegments.join('.');
      const isTracked = tracked.find((item) => item[0] === watchersKey);

      if (isTracked) {
        // przed dodaniem sprawdza czy już nie zostało dodane wcześniej i nie skonsumowane
        changes.push(watchersKey);
      }
    }

    if (Array.isArray(model)) {
      return changes;
    }

    Object.keys(model).forEach((key) => {
      const result = checkChanges(source, model[key], [...pathSegments, key]);
      if (result?.length > 0) {
        changes = changes.concat(result);
      }
    });
  } else {
    if (value !== model) {
      let rootPath = pathSegments.slice(0, -1);
      const key = pathSegments[pathSegments.length - 1];

      const watchersKey = pathSegments.join('.');
      const isTracked = tracked.find((item) => item[0] === watchersKey);

      if (isTracked) {
        changes.push(watchersKey);
      }

      const rootWatchersKey = rootPath.join('.');
      const isRootTracked = tracked.find((item) => item[0] === rootWatchersKey);

      if (isRootTracked) {
        changes.push(rootWatchersKey);
      }
    }
  }

  return changes;
}

// export function main(): void {
//   const initialState = {
//     firstName: 'Adalbertus',
//     lastName: 'Chris',
//     address: {
//       street: 'Ważniaka',
//       state: {
//         id: 1,
//         name: 'LA',
//       },
//     },
//     phones: ['123456789', '987654321'],
//   };

//   const schema = createGraph(initialState);
//   const { query } = schema;

//   const model = createReactiveModel(initialState);

//   // nie działa
//   //   rootModel.watch(
//   //     '',
//   //     () => (value) => console.log('value changes: [Address]', value)
//   //   );

//   const streetQuery = query((state) => state.address.street);

//   const unwatch = model.watch(
//     streetQuery,
//     () => (value) => console.log('value changes: [Address]', value)
//   );

//   const unwatchPhone = model.watch(
//     query((state) => state.phones),
//     () => (value) => console.log('value changes: [Phones]', value)
//   );

//   // toSignal(model.slice(query((state) => state.phones)));
//   // toSignal(model.slice((state) => state.phones));
//   const phonesQuery = query((state) => state.phones);
//   // toSignal(model, phonesQuery);
//   // .watch(() => (value) => console.log('value changes: [Phones]', value));

//   const unwatchName = model.watch(
//     query(
//       (state) => state.firstName,
//       (state) => state.lastName,
//       ([firstName, lastName]) => `${firstName} + ${lastName}`
//     ),
//     () => (value) => console.log('value changes: [My name is]', value)
//   );

//   // rootModel.watch(
//   //   path((state) => state.phones[0]),
//   //   // schema.address.state.name,
//   //   // schema.firstName
//   //   // select('address', 'state', 'name'),
//   //   () => (value) => console.log('value changes: [Phones]', value)
//   // );

//   //   rootModel.watch(
//   //     path('address.state'),
//   //     () => (value) => console.log('value changes: [Street]', value)
//   //   );

//   model.set(
//     query((state) => state.address),
//     (value) => ({
//       ...value,
//       street: 'Akacjowa',
//     })
//   );

//   // unwatch();

//   model.set(
//     query((state) => state.address.street),
//     (value) => 'Wierzbowa'
//   );

//   // zablokować możliwość wyboru 2 pól
//   model.set(
//     query((state) => state.phones),
//     (value) => [...value, '66554433']
//   );

//   // unwatchName();

//   model.watch(
//     query((state) => state),
//     () => (value) => console.log('value changes: [Root model]', value)
//   );

//   model.set(
//     query((state) => state),
//     (value) => ({
//       ...value,
//       firstName: 'Wiesław',
//       lastName: 'Paleta',
//     })
//   );

//   console.log('Root model state', model.get());
//   console.log(
//     'Phones from Root model state',
//     model.get(query((state) => state.address.street))
//   );

//   // watch na address powinien to wychwytywać?
//   //   rootModel.set(path('address.state.name'), (value) => 'NY');
// }

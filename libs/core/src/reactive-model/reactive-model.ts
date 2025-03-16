import { getRawModel } from './model';
import { createGraph } from './schema-graph';
import {
  DISABLED,
  FIRST_CHANGE,
  GraphMember,
  META_DATA,
  MODEL_REF,
  PATH,
  QUERY,
  Query,
  Source,
  SOURCE,
  STATE,
  TARGET,
  TRACKED,
  VALIDATORS,
  WATCHERS,
  $Model,
  $Value,
  Model$,
  ReactiveModel,
  SignalDef,
} from './types';

export function createReactiveModel<T extends { [key: string]: unknown }>(
  model: T
): Model$ {
  const source: Source<any> = {
    [STATE]: getRawModel(model as any) as any,
    [WATCHERS]: new Map<symbol, any>([]),
    [TRACKED]: [],
  };

  const reactiveModel: ReactiveModel<T> = {
    graph: createGraph(model),
    [SOURCE]: source,
    // TODO Poprawić get, bo teraz jest problem z typem jak używamy get, jest lub i nie wie co przypisać do pola
    get: function <Value>(query?: Query<T, Value>): Value | T {
      return (query ? query(source[STATE] as any) : source[STATE]) as any;
    },
    set: function <Value, R>(
      query: Query<T, Value>,
      fn: (value: Value) => R
    ): void {
      const target = query[TARGET][0];
      const pathSegments = target ? target.split('.') : [];
      const newModel = fn(query(source[STATE] as any));
      const changes = checkChanges(source, newModel, pathSegments);

      if (target) {
        const lastSegment = pathSegments[pathSegments.length - 1];
        let parent = source[STATE];

        for (let i = 0; i < pathSegments.length - 1; i++) {
          parent = parent[pathSegments[i]] as any;
        }

        parent[lastSegment] = newModel as any;
      } else {
        source[STATE] = newModel as any;
      }

      // runValidators(reactiveModel);

      // przed dodaniem sprawdza czy już nie zostało dodane wcześniej i nie skonsumowane
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
      const watchFn = () => watcherFn(query(source[STATE] as any));
      source[WATCHERS].set(watchId, watchFn);

      console.log('watcher registered');

      return unwatch(watchId, source);
    },
    destroy: function (): void {
      source[STATE] = null;
      source[TRACKED] = [];
      source[WATCHERS].clear();
    },
    getRef: function (selector: (schema: any) => any): any {
      const field = createField(reactiveModel, selector);

      return field;
    },
    getRefs: function (selector?: (schema: any) => any): any {
      const fields = createFields(reactiveModel, selector);

      return fields;
    },
  };

  return reactiveModel as any;
}

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
  const tracked = source[TRACKED];

  // TODO handle null - null is also object
  if (model && typeof model === 'object') {
    // jak zrobić watch na modelu? całym?
    if (value != model) {
      const watchersKey = pathSegments.join('.');
      const isTracked = tracked.find((item) => item[0] === watchersKey);

      if (isTracked) {
        // przed dodaniem sprawdza czy już nie zostało dodane wcześniej i nie skonsumowane
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
      const rootPath = pathSegments.slice(0, -1);
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

// Problem że nie można zrobić computed na dwóch różnych modelach
export const computed = <
  TS1 extends $Value<unknown>,
  TS2 extends $Value<unknown>,
  R
>(
  signal1: TS1,
  signal2: TS2,
  callback: (result: [TS1['$value'], TS2['$value']]) => R
): $Value<R> => {
  const signalFn = (signalCallback: (value) => void) => {
    signal1?.$((value) => {
      signalCallback(callback([value, signal2.$value]));
    });

    signal2?.$((value) => {
      signalCallback(callback([signal1.$value, value]));
    });
  };

  const signal = {
    [META_DATA]: [signal1[META_DATA], signal2[META_DATA]] as SignalDef<any>[],
    [FIRST_CHANGE]: false,
    [DISABLED]: false,
    $: signalFn,
    get $value(): R {
      return callback([signal1.$value, signal2.$value]);
    },
    get $errors(): { [key: string]: any } {
      return { '0': signal1.$errors, '1': signal2.$errors };
    },
  };

  return signal as any;
};

const createFields = <T>(
  reactiveModel: ReactiveModel<T>,
  selector: (schema: any) => any
): $Model => {
  const graph = reactiveModel.graph.getGraph(selector);
  const signal = createModelFields(reactiveModel, graph);

  return signal;
};

const createField = <T>(
  reactiveModel: ReactiveModel<T>,
  selector: (schema: any) => any
): $Value<T> => {
  const path = reactiveModel.graph.getPath(selector);
  const query = reactiveModel.graph.query(selector);
  const signal = createModelField(query, path, reactiveModel);

  return signal as any;
};

const createModelField = <T>(
  query,
  path: GraphMember<any>,
  reactiveModel
): $Value<T> => {
  // dodawanie validatora do grupy czyli całego obiektu, albo dziecka obiektu
  // asyncValidator => ustawia status pending? albo zwraca Promise
  // co z testami? np. dla async validatora? w sumie możemy nadpisac fetcha
  // onStateChange = new Map<symbol, (value: unknown) => void>([]);
  const signalMetaData = (reactiveModel.graph.fieldsConfigs || []).find(
    (item) => item.key === path.pathKey
  );
  const validators = signalMetaData?.config?.validators;
  const isDisabled = !!signalMetaData?.config?.disabled;

  const signalFn = (callback: (value) => void) => {
    // watchers.push(watcher);
    // this.onStateChange.set(watcher, (state: T) => fn(selector(state)));
    return reactiveModel.watch(query, () => callback);
  };

  const signal = {
    [MODEL_REF]: reactiveModel,
    [META_DATA]: {
      data: validators ? { [VALIDATORS]: validators } : null,
    },
    [QUERY]: query,
    [PATH]: path.path,
    [FIRST_CHANGE]: false,
    [DISABLED]: isDisabled,
    $: signalFn,
    set $value(value: any) {
      if (!this[DISABLED]) {
        this[MODEL_REF].set(query, (state) => value);
        this[FIRST_CHANGE] = true;
      }
    },
    get $value(): any {
      if (this[DISABLED]) {
        return undefined;
      }
      return this[MODEL_REF].get(query);
    },
    get $errors(): any {
      if (this[DISABLED]) {
        return undefined;
      }

      const errors = (this[META_DATA].data?.[VALIDATORS] || []).reduce(
        (errors, validator) => {
          return {
            ...errors,
            ...validator(this[MODEL_REF].get(query), this[MODEL_REF].get()),
          };
        },
        {}
      );

      return !errors || Object.keys(errors).length === 0 ? undefined : errors;
    },
  };

  return signal as any;
};

function createModelFields(reactiveModel, obj) {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }

  const keys = Reflect.ownKeys(obj);
  const parentPathKey = `${obj[PATH]}`;
  const parentQuery = reactiveModel.graph.queryFromPath(parentPathKey);
  const parentPath = reactiveModel.graph.getPathByKey(parentPathKey);
  const result = createModelField(parentQuery, parentPath, reactiveModel);

  for (const key of keys) {
    if (key === PATH) {
      continue;
    }

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      result[key] = createModelFields(reactiveModel, obj[key]);
    } else {
      const pathKey = obj[key];
      const query = reactiveModel.graph.queryFromPath(pathKey);
      const path = reactiveModel.graph.getPathByKey(pathKey);
      result[key] = createModelField(query, path, reactiveModel);
    }
  }

  return result;
}

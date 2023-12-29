import { SchemaMember, createSchema } from './schema';
import { WATCHERS, createNestedModel } from './source-model';

const STATE_ROOT = Symbol('root');
const TRACKED = Symbol('tracked');

export type Watcher<
  P extends unknown[],
  R extends (args: unknown[]) => unknown
> = {
  paths: P;
  resolver: R;
};

type SchemaMemberType<T> = T extends SchemaMember<infer S> ? S : never;

export function watcher<M1 extends SchemaMember<unknown>, R>(
  sm1: M1,
  resolver: (value: [SchemaMemberType<M1>]) => R
): Watcher<[M1], (value: [SchemaMemberType<M1>]) => R>;
export function watcher<
  M1 extends SchemaMember<unknown>,
  M2 extends SchemaMember<unknown>,
  R
>(
  sm1: M1,
  sm2: M2,
  resolver: (value: [SchemaMemberType<M1>, SchemaMemberType<M2>]) => R
): Watcher<
  [M1, M2],
  (value: [SchemaMemberType<M1>, SchemaMemberType<M2>]) => R
>;
export function watcher(...args: any[]): any {
  const resolver = args.pop();
  const schemaMembers = [...args];

  return {
    paths: schemaMembers,
    resolver,
  };
}

function getValue(
  state,
  watcher: Watcher<unknown[], (args: unknown[]) => unknown>
) {
  let values = [];
  let selectors = watcher.paths;

  for (let index = 0; index < selectors.length; index++) {
    const pathSegments = (selectors[index] as SchemaMember<any>).path
      .split('.')
      .slice(1);
    let value = state;

    for (let i = 0; i < pathSegments.length; i++) {
      value = value[pathSegments[i]];
    }

    values.push(value);
  }

  return watcher.resolver(values);
}

export function createReactiveModel<T>(
  schema,
  model: T
): {
  sourceModel: {
    [STATE_ROOT]: T;
  };

  get: <M>(schemaMember?: SchemaMember<M>) => T;
  set: <M, R>(schemaMember: SchemaMember<M>, fn: (value: M) => R) => void;
  watch: <M>(
    schemaMember: SchemaMember<M>,
    connect: () => (value: M) => void
  ) => void;
} {
  const watchers = new Map<string | symbol, any>([]);
  const tracked = new Set();
  // co gdyby watchers dodać do fasady? wtedy pozbywamy się dodatkowego obiektu
  const source: T = {} as T;

  const sourceValue = createNestedModel(model, source);

  const sourceModel = {
    [STATE_ROOT]: source,
    [WATCHERS]: watchers,
    [TRACKED]: tracked,
  };

  const rootModel = {
    sourceModel,

    get: <M>(schemaMember?: SchemaMember<M>) => {
      // return sourceModel[STATE_ROOT]; // source powinien być readonly i każde jego pole

      const pathSegments = schemaMember.path.split('.').slice(1);
      let source = sourceModel[STATE_ROOT];

      for (let i = 0; i < pathSegments.length; i++) {
        source = source[pathSegments[i]];
      }

      return source;
    },
    set: <M, R>(schemaMember: SchemaMember<M>, fn: (value: M) => R) => {
      const pathSegments = schemaMember.path.split('.').slice(1);
      let lastSegment = pathSegments[pathSegments.length - 1] || STATE_ROOT;
      let parent = sourceModel;
      let sourceForNewModel = sourceModel[STATE_ROOT];

      for (let i = 0; i < pathSegments.length; i++) {
        parent = source as any;
        sourceForNewModel = source[pathSegments[i]];
      }

      const newModel = fn(sourceForNewModel as any);

      const changes = checkChanges(sourceModel, newModel, [
        STATE_ROOT,
        ...pathSegments,
      ]);

      parent[lastSegment] = newModel;

      // przed dodaniem sprawdza czy już nie zostało dodane wcześniej i nie skonsumowane
      const filteredChanges = new Set(changes);
      const computed = [];

      filteredChanges.forEach((key: string) => {
        let propWatchers: any[] = sourceModel[WATCHERS].get(key);
        const pathSegments = key.split('.');

        if (propWatchers?.length > 0) {
          propWatchers.forEach((watcher) => {
            if (typeof watcher === 'symbol') {
              if (computed.includes(watcher)) {
                return;
              } else {
                computed.push(watcher);
                const watcherObj = sourceModel[WATCHERS].get(watcher);

                const computedValue = getValue(
                  sourceModel[STATE_ROOT],
                  watcherObj
                );
                watcherObj.watchFn(computedValue);
              }
            } else {
              const value = getByPath(sourceModel, [
                STATE_ROOT,
                ...pathSegments,
              ]);
              watcher(value);
            }
          });
        }
      });

      // updateFacade(facade, source, watchers, newModel);
    },

    // co z unwatch?
    watch: <M>(
      schemaMemberOrWatcher:
        | SchemaMember<M>
        | Watcher<unknown[], (args: unknown[]) => unknown>,
      connect: () => (value: M) => void
    ) => {
      const isWatcher = schemaMemberOrWatcher['resolver'] != null;
      const watchFn = connect();

      if (isWatcher) {
        const watcher = schemaMemberOrWatcher as Watcher<
          unknown[],
          (args: unknown[]) => unknown
        >;

        const watcherId = Symbol('computed');
        sourceModel[WATCHERS].set(watcherId, { ...watcher, watchFn });

        watcher.paths.forEach((schemaMember: SchemaMember<any>) => {
          let watchersPath = schemaMember.path.replace('root.', '');

          sourceModel[TRACKED].add(watchersPath);

          let propWatchers = sourceModel[WATCHERS].get(watchersPath);

          if (!propWatchers) {
            sourceModel[WATCHERS].set(watchersPath, [watcherId]);
          } else {
            propWatchers.push(watcherId);
          }
        });
      } else {
        const schemaMember = schemaMemberOrWatcher as SchemaMember<M>;
        // const pathSegments = schemaMember.path.split('.').slice(1);
        // let key = 'root';
        let watchersPath = schemaMember.path.replace('root.', '');
        sourceModel[TRACKED].add(watchersPath);

        let propWatchers = sourceModel[WATCHERS].get(watchersPath);

        if (!propWatchers) {
          sourceModel[WATCHERS].set(watchersPath, [watchFn]);
        } else {
          propWatchers.push(watchFn);
        }
      }

      console.log('watcher registered');
    },
  };

  console.log(rootModel);
  return rootModel;
}

function getByPath(source, path: (string | symbol)[]) {
  let value = source;
  path.forEach((item) => {
    value = value[item];
  });

  return value;
}

// co jak ktoś w modelu będzie miał więcej pól niż w source?
function checkChanges(source, model, path: (string | symbol)[]) {
  // mozna sprawdzać referencje, jeżeli są takie same modelu i source to wtedy wgl nie wykonujemy metodki,
  // jak nie będziemy zmieniać referencji to będziemy musieli skanować potem cały model

  let changes = [];

  if (
    model &&
    typeof model === 'object' &&
    ['Array', 'Object'].includes(model.constructor.name)
  ) {
    Object.keys(model).forEach((key) => {
      const value = getByPath(source, path)[key];

      if (
        value &&
        typeof value === 'object' &&
        ['Array', 'Object'].includes(value.constructor.name)
      ) {
        const tmpPath = [...path, key];
        const result = checkChanges(source, model[key], tmpPath);
        if (result?.length > 0) {
          changes = changes.concat(result);
        }
      } else {
        // getByPath(source, path)[key] = model[key];

        if (value !== model[key]) {
          const watchersKey = [...path.slice(1), key].join('.');
          const isTracked = source[TRACKED].has(watchersKey);

          if (isTracked) {
            // przed dodaniem sprawdza czy już nie zostało dodane wcześniej i nie skonsumowane
            changes.push(watchersKey);
          }

          const rootWatchersKey = path.slice(1).join('.');
          const isRootTracked = source[TRACKED].has(rootWatchersKey);

          if (isRootTracked) {
            changes.push(rootWatchersKey);
          }
        }
      }
    });
  } else {
    const value = getByPath(source, path);

    if (value !== model) {
      let valuePath = path.slice(0, -1);
      const key = path[path.length - 1];

      const watchersKey = [...valuePath.slice(1), key].join('.');
      const isTracked = source[TRACKED].has(watchersKey);

      if (isTracked) {
        changes.push(watchersKey);
      }

      const rootWatchersKey = valuePath.slice(1).join('.');
      const isRootTracked = source[TRACKED].has(rootWatchersKey);

      if (isRootTracked) {
        changes.push(rootWatchersKey);
      }
    }
  }

  return changes;
}

export function main(): void {
  const initialState = {
    firstName: 'Adalbertus',
    lastName: 'Chris',
    address: {
      street: 'Ważniaka',
      state: {
        id: 1,
        name: 'LA',
      },
    },
  };

  //   const schema = createSchema(initialState);

  //   const { path, select } = schema;

  // const [model, source, watchers, rootModel] = createReactiveModel(
  //   null,
  //   initialState
  // );

  const rootModel = createReactiveModel(null, initialState);

  const { path } = createSchema(initialState);

  //   console.log(model);
  //   console.log(source);
  //   console.log(watchers);
  //   console.log(rootModel);

  // nie działa
  //   rootModel.watch(
  //     '',
  //     () => (value) => console.log('value changes: [Address]', value)
  //   );

  rootModel.watch(
    path((state) => state.address.street),
    // schema.address.state.name,
    // schema.firstName
    // select('address', 'state', 'name'),
    () => (value) => console.log('value changes: [Address]', value)
  );

  //   rootModel.watch(
  //     path('address.state'),
  //     () => (value) => console.log('value changes: [Street]', value)
  //   );

  rootModel.set(
    path((state) => state.address),
    (value) => ({
      ...value,
      street: 'Akacjowa',
    })
  );

  rootModel.set(
    path((state) => state.address.street),
    (value) => 'Wierzbowa'
  );

  console.log('Root model state', rootModel.get());

  // watch na address powinien to wychwytywać?
  //   rootModel.set(path('address.state.name'), (value) => 'NY');
}

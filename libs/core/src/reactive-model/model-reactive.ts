import { SchemaMember, createSchema } from './schema';
import { WATCHERS, createNestedModel } from './source-model';

const STATE_ROOT = Symbol('root');

export function createReactiveModel<T>(
  schema,
  model: T
): {
  sourceModel: {
    [STATE_ROOT]: T;
  };

  get: <M>(schemaMember?: SchemaMember<T>) => T;
  set: <M, R>(schemaMember: SchemaMember<M>, fn: (value: M) => R) => void;
  watch: <M>(
    schemaMember: SchemaMember<M>,
    connect: () => (value: M) => void
  ) => void;
} {
  const watchers = new Map<string, any>([]);
  // co gdyby watchers dodać do fasady? wtedy pozbywamy się dodatkowego obiektu
  const source: T = {} as T;

  const sourceValue = createNestedModel(model, source);

  const sourceModel = { [STATE_ROOT]: source, [WATCHERS]: watchers };

  const rootModel = {
    sourceModel,

    get: (schemaMember?: SchemaMember<T>) => {
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
      let source = sourceModel[STATE_ROOT];

      for (let i = 0; i < pathSegments.length; i++) {
        parent = source as any;
        source = source[pathSegments[i]];
      }

      const newModel = fn(source as any);

      const changes = checkChanges(sourceModel, newModel, [
        STATE_ROOT,
        ...pathSegments,
      ]);

      parent[lastSegment] = newModel;

      changes.forEach((fn) => {
        fn();
      });

      // updateFacade(facade, source, watchers, newModel);
    },

    // co z unwatch?
    watch: <M>(
      schemaMember: SchemaMember<M>,
      connect: () => (value: M) => void
    ) => {
      const pathSegments = schemaMember.path.split('.').slice(1);
      let key = 'root';

      const watchFn = connect();

      let watchersPath = schemaMember.path.replace('root.', '');
      let propWatchers = sourceModel[WATCHERS].get(watchersPath);

      if (!propWatchers) {
        sourceModel[WATCHERS].set(watchersPath, [watchFn]);
      } else {
        propWatchers.push(watchFn);
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
          const propWatchers =
            source[WATCHERS].get([...path.slice(1), key].join('.')) || [];

          // przed dodaniem sprawdza czy już nie zostało dodane wcześniej i nie skonsumowane
          changes = changes.concat(
            propWatchers?.map(
              (watcher) => () => watcher(getByPath(source, path)[key])
            )
          );

          const rootWatchers =
            source[WATCHERS].get(path.slice(1).join('.')) || [];

          // const rootWatchers =
          //   (parentWatchers[WATCHERS] as Map<string, any>).get('root') || [];

          changes = changes.concat(
            rootWatchers?.map(
              (watcher) => () => watcher(getByPath(source, path))
            )
          );
        }

        // const rootWatchers =
        //   (watchers[WATCHERS] as Map<string, any>).get('root') || [];
        // rootWatchers?.forEach((watcher) => watcher(facade));
      }
    });
  } else {
    const value = getByPath(source, path);

    if (value !== model) {
      let valuePath = path.slice(0, -1);
      const key = path[path.length - 1];

      const propWatchers =
        source[WATCHERS].get([...valuePath.slice(1), key].join('.')) || [];

      changes = changes.concat(
        propWatchers?.map(
          (watcher) => () => watcher(getByPath(source, valuePath)[key])
        )
      );

      const rootWatchers =
        source[WATCHERS].get(valuePath.slice(1).join('.')) || [];

      // const rootWatchers =
      //   (parentWatchers[WATCHERS] as Map<string, any>).get('root') || [];

      changes = changes.concat(
        rootWatchers?.map(
          (watcher) => () => watcher(getByPath(source, valuePath))
        )
      );
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

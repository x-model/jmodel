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
  RefDef,
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

function checkChanges<State, Model>(
  source: Source<State>,
  model: Model,
  pathSegments: string[]
): string[] {
  const value = getByPath(source[STATE], pathSegments);
  let changes: string[] = [];
  const tracked = source[TRACKED];

  if (model && typeof model === 'object') {
    if (value != model) {
      const watchersKey = pathSegments.join('.');
      const isTracked = tracked.find((item) => item[0] === watchersKey);

      if (isTracked) {
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

export const computed = <
  TS1 extends $Value<unknown>,
  TS2 extends $Value<unknown>,
  R
>(
  ref1: TS1,
  ref2: TS2,
  callback: (result: [TS1['$value'], TS2['$value']]) => R
): $Value<R> => {
  const refFn = (refCallback: (value) => void) => {
    ref1?.$((value) => {
      refCallback(callback([value, ref2.$value]));
    });

    ref2?.$((value) => {
      refCallback(callback([ref1.$value, value]));
    });
  };

  const ref = {
    [META_DATA]: [ref1[META_DATA], ref2[META_DATA]] as RefDef<any>[],
    [FIRST_CHANGE]: false,
    [DISABLED]: false,
    $: refFn,
    get $value(): R {
      return callback([ref1.$value, ref2.$value]);
    },
    get $errors(): { [key: string]: any } {
      return { '0': ref1.$errors, '1': ref2.$errors };
    },
  };

  return ref as any;
};

const createFields = <T>(
  reactiveModel: ReactiveModel<T>,
  selector: (schema: any) => any
): $Model => {
  const graph = reactiveModel.graph.getGraph(selector);
  const ref = createModelFields(reactiveModel, graph);

  return ref;
};

const createField = <T>(
  reactiveModel: ReactiveModel<T>,
  selector: (schema: any) => any
): $Value<T> => {
  const path = reactiveModel.graph.getPath(selector);
  const query = reactiveModel.graph.query(selector);
  const ref = createModelField(query, path, reactiveModel);

  return ref as any;
};

const createModelField = <T>(
  query,
  path: GraphMember<any>,
  reactiveModel
): $Value<T> => {
  const refMetaData = (reactiveModel.graph.fieldsConfigs || []).find(
    (item) => item.key === path.pathKey
  );
  const validators = refMetaData?.config?.validators;
  const isDisabled = !!refMetaData?.config?.disabled;

  const refFn = (callback: (value) => void) => {
    return reactiveModel.watch(query, () => callback);
  };

  const ref = {
    [MODEL_REF]: reactiveModel,
    [META_DATA]: {
      data: validators ? { [VALIDATORS]: validators } : null,
    },
    [QUERY]: query,
    [PATH]: path.path,
    [FIRST_CHANGE]: false,
    [DISABLED]: isDisabled,
    $: refFn,
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

  return ref as any;
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

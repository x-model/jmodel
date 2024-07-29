export const PATH = Symbol('PATH');
export const TARGET = Symbol('TARGET');
export const SIGNAL = Symbol('SIGNAL');
export const SIGNAL_VALUE = Symbol('SIGNAL_VALUE');
export const FROM_SCHEMA = Symbol('FROM_SCHEMA');
export const VALIDATORS = Symbol('VALIDATORS');

export type GraphMember<T> = {
  path: string;
};

export type GraphMemberType<T> = T extends GraphMember<infer S> ? S : never;

export type Query<Model, Result> = ((model: Model) => Result) & {
  [TARGET]: string[];
};

export type GraphMembersTypes<T> = T extends GraphMember<infer S>[]
  ? S[]
  : never;

export type Graph<T> = {
  path<R>(selector: (model: T) => R): GraphMember<R>;
  getPathByKey?<R>(key: string): GraphMember<R>;
  queryFromPath?(path: any): Query<T, any>;
  queryFromPaths?(...args: any[]): Query<T, any>;
  signals?: any[];

  query<T1>(s1: (model: T) => T1): Query<T, T1>;
  query<T1, R>(s1: (model: T) => T1, resolver: (value: T1) => R): Query<T, R>;
  query<T1, T2, R>(
    s1: (model: T) => T1,
    s2: (model: T) => T2,
    resolver: (value: [T1, T2]) => R
  ): Query<T, R>;
  query<T1, T2, T3, R>(
    s1: (model: T) => T1,
    s2: (model: T) => T2,
    s3: (model: T) => T3,
    resolver: (value: [T1, T2, T3]) => R
  ): Query<T, R>;
  query<T1, T2, T3, T4, R>(
    s1: (model: T) => T1,
    s2: (model: T) => T2,
    s3: (model: T) => T3,
    s4: (model: T) => T4,
    resolver: (value: [T1, T2, T3, T4]) => R
  ): Query<T, R>;
  query<T1, T2, T3, T4, T5, R>(
    s1: (model: T) => T1,
    s2: (model: T) => T2,
    s3: (model: T) => T3,
    s4: (model: T) => T4,
    resolver: (value: [T1, T2, T3, T4, T5]) => R
  ): Query<T, R>;
};

export function rSignal<T>(
  value: T,
  validators?: any[],
  options?: { value?: any }
) {
  return {
    [SIGNAL]: value,
    [VALIDATORS]: validators,
    [SIGNAL_VALUE]:
      options && options.hasOwnProperty('value') ? options.value : FROM_SCHEMA,
  };
}

export function createGraph<Model>(initialModel: Model): Graph<Model> {
  const [result, props, parents] = createSchemaModel(initialModel);

  const getPath = <R>(pathSelector: (model: Model) => R) => {
    const value = pathSelector(result as any);

    const selector = pathSelector.toString();

    if (!value || selector.match(/\[\d*\]/)) {
      let description = '';
      if (selector.match(/\[\d*\]/)) {
        description = 'Array elements are not supported';
      }

      throw new Error(`Invalid selector: ${pathSelector}. ${description}`);
    }

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

    return { path: path.slice(1).join('.') } as GraphMember<R>;
  };

  const query = (...args: unknown[]): Query<Model, unknown> => {
    let queryFn;
    let graphMembers: GraphMember<unknown>[];

    if (args.length === 1) {
      graphMembers = [getPath(args[0] as any)];
      queryFn = (state) => getValue(state, graphMembers[0]);
    } else {
      const resolver = args.pop();
      graphMembers = args.map((item) => getPath(item as any));
      queryFn = (state) =>
        getComputedValue(state, graphMembers, resolver as any);
    }

    queryFn[TARGET] = graphMembers.map((item) => item.path);

    return queryFn;
  };

  return { path: getPath, query };
}

export function createGraph2<Model>(initialModel: Model): Graph<Model> {
  const [result, props, parents, signals] = createSchemaModel(initialModel);

  const getPath = <R>(pathSelector: (model: Model) => R) => {
    const value = pathSelector(result as any);

    const selector = pathSelector.toString();

    if (!value || selector.match(/\[\d*\]/)) {
      let description = '';
      if (selector.match(/\[\d*\]/)) {
        description = 'Array elements are not supported';
      }

      throw new Error(`Invalid selector: ${pathSelector}. ${description}`);
    }

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

    return { path: path.slice(1).join('.') } as GraphMember<R>;
  };

  const query = (...args: unknown[]): Query<Model, unknown> => {
    let queryFn;
    let graphMembers: GraphMember<unknown>[];

    if (args.length === 1) {
      graphMembers = [getPath(args[0] as any)];
      queryFn = (state) => getValue(state, graphMembers[0]);
    } else {
      const resolver = args.pop();
      graphMembers = args.map((item) => getPath(item as any));
      queryFn = (state) =>
        getComputedValue(state, graphMembers, resolver as any);
    }

    queryFn[TARGET] = graphMembers.map((item) => item.path);

    return queryFn;
  };

  const getPathByKey = <R>(value: string) => {
    const key = value;

    const pathKeys = key.split('|');
    let path = [];

    if (pathKeys.length === 1) {
      path = generatePath(pathKeys[0], props, parents);
    } else {
      path = generatePath(pathKeys[1], props, parents);
      const propName = props[+pathKeys[0]];
      path.push(propName);
    }

    return { path: path.slice(1).join('.') } as GraphMember<R>;
  };

  const queryFromPath = (pathKey: any) => {
    let queryFn;
    let graphMember: GraphMember<unknown>;

    graphMember = getPathByKey<string>(pathKey);
    queryFn = (state) => getValue(state, graphMember);

    queryFn[TARGET] = [graphMember.path];

    return queryFn;
  };

  const queryFromPaths = (...args: unknown[]): Query<Model, unknown> => {
    let queryFn;
    let graphMembers: GraphMember<unknown>[];

    if (args.length === 1) {
      graphMembers = [{ path: args[0] as any }];
      queryFn = (state) => getValue(state, graphMembers[0]);
    } else {
      const resolver = args.pop();
      graphMembers = args.map((item) => ({ path: item as any }));
      queryFn = (state) =>
        getComputedValue(state, graphMembers, resolver as any);
    }

    queryFn[TARGET] = graphMembers.map((item) => item.path);

    return queryFn;
  };

  return {
    path: getPath,
    getPathByKey,
    query,
    queryFromPath,
    queryFromPaths,
    signals,
  };
}

export function createSchemaModel(model): [
  result: {
    [PATH]: number;
  },
  props: string[],
  parents: string[],
  signals: any[]
] {
  const pathId = 0;
  const result = {
    [PATH]: pathId,
  };

  const props = [''];
  const parents = ['0'];
  const signals: any[] = [];

  if (!model || typeof model !== 'object') {
    throw new Error('Model has to be object');
  }

  createChildSchemaModel(model, signals, result, props, parents, pathId);
  console.log('Graph', result, props, parents, signals);
  return [result, props, parents, signals];
}

function createChildSchemaModel(
  model: any,
  signals: any[],
  result: any,
  props: string[],
  parents: string[],
  parentId: number
) {
  if (Array.isArray(model)) {
    // TODO
  }

  // przypadek model = rSignal({...})
  // TODO handle null - null is also object
  if (typeof model === 'object' && Reflect.ownKeys(model).includes(SIGNAL)) {
    if (typeof model[SIGNAL] === 'object') {
      // modelCopy = createModel(model[SIGNAL]);
    } else {
      // return model[SIGNAL];
    }
  }

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
      Reflect.ownKeys(value).includes(SIGNAL) &&
      typeof value[SIGNAL] !== 'object'
    ) {
      signals.push({
        key: `${keyId}|${parentId}`,
        data: { ...value, [SIGNAL]: undefined },
      });
      value = value[SIGNAL];
    }

    if (value && typeof value === 'object') {
      const childId = parents.length;
      const parent = `${keyId}|${parentId}`;

      if (parents.includes(parent)) {
        parents.findIndex((item) => item === parent);
      } else {
        parents.push(parent);
      }

      if (
        Reflect.ownKeys(value).includes(SIGNAL) &&
        typeof value[SIGNAL] === 'object'
      ) {
        signals.push({
          key: childId + '',
          data: { ...value, [SIGNAL]: undefined },
        });
        value = value[SIGNAL];
      }

      if (Array.isArray(value)) {
        // TODO Change to proxy
        const childModel = {
          [PATH]: childId,
        };

        value = childModel;
      } else {
        const childModel = {
          [PATH]: childId,
        };

        value = createChildSchemaModel(
          value,
          signals,
          childModel,
          props,
          parents,
          childId
        );
      }
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

export function getValue<Model, Value>(
  model: Model,
  graphMember: GraphMember<Value>
): Model | Value {
  if (model === undefined) {
    return undefined;
  }

  let value = model;

  const pathSegments = !!graphMember.path ? graphMember.path.split('.') : [];

  for (let i = 0; i < pathSegments.length; i++) {
    value = value[pathSegments[i]];

    if (value === undefined) {
      break;
    }
  }

  return value;
}

export function getComputedValue<
  Model,
  GraphMembers extends GraphMember<unknown>[],
  Result
>(
  model: Model,
  graphMembers: GraphMembers,
  resolver: (value: GraphMembersTypes<GraphMembers>) => Result
): Result {
  let values = [];

  for (let index = 0; index < graphMembers.length; index++) {
    const path = graphMembers[index].path;

    const pathSegments = !!path ? path.split('.') : [];
    let value = model;

    for (let i = 0; i < pathSegments.length; i++) {
      value = value[pathSegments[i]];
    }

    values.push(value);
  }

  return resolver(values as GraphMembersTypes<GraphMembers>);
}

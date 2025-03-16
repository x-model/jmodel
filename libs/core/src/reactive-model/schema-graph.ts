import {
  Graph,
  GraphMember,
  GraphMembersTypes,
  PATH,
  Query,
  TARGET,
} from './types';
import { buildGraph } from './graph';

export function createGraph<Model>(initialModel: Model): Graph<Model> {
  const { graph, parents, parentProps, props, fieldsConfigs } =
    buildGraph(initialModel);

  const getPath = <R>(pathSelector: (model: Model) => R) => {
    const value = pathSelector(graph as any);

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
      path = generatePath(pathKeys, props, parents, parentProps);
    } else {
      path = generatePath(pathKeys[1], props, parents, parentProps);
      const propName = props[+pathKeys[0]];
      path.push(propName);
    }

    return { pathKey: key, path: path.slice(1).join('.') } as GraphMember<R>;
  };

  const getGraph = <R>(pathSelector: (model: Model) => R) => {
    const value = pathSelector(graph as any);

    const selector = pathSelector.toString();

    if (!value || selector.match(/\[\d*\]/)) {
      let description = '';
      if (selector.match(/\[\d*\]/)) {
        description = 'Array elements are not supported';
      }

      throw new Error(`Invalid selector: ${pathSelector}. ${description}`);
    }

    if (typeof value !== 'object') {
      const description = 'It has to be object';
      throw new Error(`Invalid selector: ${pathSelector}. ${description}`);
    }

    return value;
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
      path = generatePath(pathKeys[0], props, parents, parentProps);
    } else {
      path = generatePath(pathKeys[1], props, parents, parentProps);

      const propName = props[+pathKeys[0]];
      path.push(propName);
    }

    return { pathKey: value, path: path.slice(1).join('.') } as GraphMember<R>;
  };

  const queryFromPath = (pathKey: any) => {
    const graphMember: GraphMember<unknown> = getPathByKey<string>(pathKey);
    const queryFn = (state) => getValue(state, graphMember);

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
    getPath,
    getPathByKey,
    query,
    queryFromPath,
    queryFromPaths,
    getGraph,
    fieldsConfigs,
  };
}

function generatePath(parentId: string, props, parents, parentProps) {
  let paths = [];

  if (parentId != null && +parentId >= 0) {
    const parentIndex = parents[+parentId];
    const propIndex = parentProps[+parentId];
    const propName = props[+propIndex];
    paths = [
      ...generatePath(parentIndex, props, parents, parentProps),
      propName,
    ];
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

  const pathSegments = graphMember.path ? graphMember.path.split('.') : [];

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
  const values = [];

  for (let index = 0; index < graphMembers.length; index++) {
    const path = graphMembers[index].path;

    const pathSegments = path ? path.split('.') : [];
    let value = model;

    for (let i = 0; i < pathSegments.length; i++) {
      value = value[pathSegments[i]];
    }

    values.push(value);
  }

  return resolver(values as GraphMembersTypes<GraphMembers>);
}

function flatObject(obj, parentKey = '', result = {}) {
  if (!obj || typeof obj !== 'object') {
    return undefined;
  }

  for (const key of Reflect.ownKeys(obj)) {
    const fullKey = parentKey
      ? `${parentKey}${
          key.toString() === PATH.toString() ? '[PATH]' : '.' + (key as string)
        }`
      : key.toString() === PATH.toString()
      ? '[PATH]'
      : (key as string);

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      flatObject(obj[key], fullKey, result); // Recursive call for nested objects
    } else {
      result[fullKey] = obj[key]; // Assign value for non-object properties
    }
  }
  return result;
}

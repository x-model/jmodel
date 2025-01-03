import { ExtractedSignalModel } from './new-types';

export const FIELD = Symbol('FIELD');
export const INITIAL_VALUE = Symbol('INITIAL_VALUE');
export const SCHEMA_FIELD = Symbol('SCHEMA_FIELD');
export const FIELD_CONFIG = Symbol('FIELD_CONFIG');
export const _: any = Symbol('UNSET');
export const SOURCE = Symbol('SOURCE');
export const WATCHERS = Symbol('WATCHERS');
export const STATE = Symbol('STATE');
export const TRACKED = Symbol('TRACKED');
export const CALLBACK = Symbol('CALLBACK');
export const QUERY = Symbol('QUERY');
export const PATH = Symbol('PATH');
export const META_DATA = Symbol('META_DATA');
export const MODEL_REF = Symbol('MODEL_REF');
export const DISABLED = Symbol('DISABLED');
export const FIRST_CHANGE = Symbol('FIRST_CHANGE');
export const TARGET = Symbol('TARGET');
export const SIGNAL = Symbol('SIGNAL');
export const SIGNAL_GRAPH = Symbol('SIGNAL_GRAPH');
export const SIGNAL_VALUE = Symbol('SIGNAL_VALUE');
export const FROM_SCHEMA = Symbol('FROM_SCHEMA');
export const VALIDATORS = Symbol('VALIDATORS');
export const SCHEMA = Symbol('SCHEMA');

export type GraphMember<T> = {
  pathKey?: string;
  path: string;
};

export type GraphObjectValue<TGraph> = TGraph;

export type GraphMemberType<T> = T extends GraphMember<infer S> ? S : never;

export type Query<Model, Result> = ((model: Model) => Result) & {
  [TARGET]: string[];
};

export type GraphMembersTypes<T> = T extends GraphMember<infer S>[]
  ? S[]
  : never;

export type Graph<T> = {
  getPath<R>(selector: (model: T) => R): GraphMember<R>;
  getGraph<R>(selector: (model: T) => R): any;
  getPathByKey?<R>(key: string): GraphMember<R>;
  queryFromPath?(path: any): Query<T, any>;
  queryFromPaths?(...args: any[]): Query<T, any>;
  fieldsConfigs?: any[];

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

export interface ReactiveModel<T> {
  graph?: any;
  [SOURCE]: Source<ExtractedSignalModel<T>>;
  get: <Value>(query?: Query<T, Value>) => Value | T;
  set: <Value, R>(query: Query<T, Value>, fn: (value: Value) => R) => void;
  watch<Value>(
    query: Query<T, Value>,
    connect: () => (value: Value) => void
  ): () => void;
  destroy: () => void;
}

export type Source<T> = {
  [STATE]: T;
  [WATCHERS]: Map<symbol, any>;
  [TRACKED]: [string, symbol][];
};

export function $field<T>(
  value: T,
  options?: {
    readonly?: boolean;
    disabled?: boolean;
    validators?: any[];
  }
) {
  const settings = {
    [FIELD]: true,
    [INITIAL_VALUE]: value,
  };

  if (options) {
    settings[FIELD_CONFIG] = { ...options };
  }

  return settings;
}

export function $schema<T>(
  schema: T,
  options?: {
    readonly?: boolean;
    disabled?: boolean;
    validators?: any[];
  }
) {
  const settings = {
    [SCHEMA_FIELD]: schema,
  };

  if (options) {
    settings[FIELD_CONFIG] = { ...options };
  }

  return settings;
}

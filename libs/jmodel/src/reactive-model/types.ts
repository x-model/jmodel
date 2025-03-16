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
export const REF = Symbol('REF');
export const REF_GRAPH = Symbol('REF_GRAPH');
export const REF_VALUE = Symbol('REF_VALUE');
export const VALIDATORS = Symbol('VALIDATORS');
export const SCHEMA = Symbol('SCHEMA');

export type GraphMember<T> = {
  pathKey?: string;
  path: string;
};

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
  [SOURCE]: Source<any>;
  get: <Value>(query?: Query<T, Value>) => Value | T;
  set: <Value, R>(query: Query<T, Value>, fn: (value: Value) => R) => void;
  watch<Value>(
    query: Query<T, Value>,
    connect: () => (value: Value) => void
  ): () => void;
  getRef: (schema: any) => any;
  getRefs: (schema: any) => any;
  destroy: () => void;
}

export type Source<T> = {
  [STATE]: T;
  [WATCHERS]: Map<symbol, any>;
  [TRACKED]: [string, symbol][];
};

///////////////////////////////////////////////////////////////////

export type RefObject<T extends { [key: string]: unknown }> = {
  [Property in keyof T]: T[Property] extends RefDef<infer SInner, infer SGraph>
    ? SInner extends { [key: string]: unknown }
      ? Unwrap<RefObject<SInner>>
      : SInner extends symbol
      ? SGraph extends { [key: string]: unknown }
        ? Unwrap<RefObject<SGraph>>
        : SGraph
      : SInner
    : T[Property];
};

export type ExtractedRefModel<T> = T extends RefDef<infer M>
  ? M extends { [key: string]: unknown }
    ? Unwrap<RefObject<M>>
    : M
  : T;

export type Method<R> = (...args: any[]) => R;

export type Methods = Record<string, Method<unknown>>;

export type Factory<Input, Output> = (context: Input) => Output;

export type Unwrap<T> = NonNullable<{ [K in keyof T]: T[K] }>;

export type Validator<TValue, TState = any> = (
  value: TValue,
  state: TState
) => Record<string, boolean>;

export type RefDef<TValue, TGraph = any> = {
  [REF]: TValue;
  [VALIDATORS]?: Validator<TValue>[];
  [DISABLED]?: boolean;
  [REF_GRAPH]?: TGraph;
};

export type $ValueProps<T> = T extends { [key: string]: unknown }
  ? {
      [Property in keyof T as T[Property] extends $Value<unknown>
        ? Property
        : never]: T[Property];
    }
  : T;

export type $Value<T> = {
  // [MODEL_REF]?: ReactiveModel<any>;
  // [META_DATA]: RefDef<any> | RefDef<any>[];
  // [QUERY]?: any;
  // [PATH]?: any;
  // [FIRST_CHANGE]: boolean;
  // [DISABLED]: boolean;
  $value: T;
  $errors: { [key: string]: any };
  $: (callback: (value: T) => void) => void;
} & $ValueProps<T>;

export type ModelObject<T extends { [key: string]: unknown }> = {
  [Property in keyof T]: T[Property] extends RefDef<infer SInner, infer SGraph>
    ? SInner extends { [key: string]: unknown }
      ? $Value<Unwrap<ModelObject<SInner>>>
      : SInner extends symbol
      ? SGraph extends { [key: string]: unknown }
        ? $Value<Unwrap<ModelObject<SGraph>>>
        : SGraph
      : $Value<SInner extends boolean ? boolean : SInner>
    : T[Property];
};

export type $Model<T = any> = T extends RefDef<infer M>
  ? M extends { [key: string]: unknown }
    ? $Value<Unwrap<ModelObject<M>>>
    : M
  : T;

export type Model$ = any;
// {
//   getRef: <R>(selector: (schema: T) => string) => $Value<R>;
// };

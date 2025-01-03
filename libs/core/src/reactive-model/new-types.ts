import {
  DISABLED,
  FIRST_CHANGE,
  META_DATA,
  MODEL_REF,
  PATH,
  QUERY,
  SIGNAL,
  SIGNAL_GRAPH,
  STATE,
  TARGET,
  TRACKED,
  VALIDATORS,
  WATCHERS,
} from './model-utils';

export type SignalObject<T extends { [key: string]: unknown }> = {
  [Property in keyof T]: T[Property] extends SignalDef<
    infer SInner,
    infer SGraph
  >
    ? SInner extends { [key: string]: unknown }
      ? Unwrap<SignalObject<SInner>>
      : SInner extends symbol
      ? SGraph extends { [key: string]: unknown }
        ? Unwrap<SignalObject<SGraph>>
        : SGraph
      : SInner
    : T[Property];
};

export type ExtractedSignalModel<T> = T extends SignalDef<infer M>
  ? M extends { [key: string]: unknown }
    ? Unwrap<SignalObject<M>>
    : M
  : T;

// export interface ReactiveModel<T> {
//   graph?: any;
//   [SOURCE]: Source<ExtractedSignalModel<T>>;
//   get: <Value>(query?: Query<T, Value>) => Value | T;
//   set: <Value, R>(query: Query<T, Value>, fn: (value: Value) => R) => void;
//   watch<Value>(
//     query: Query<T, Value>,
//     connect: () => (value: Value) => void
//   ): () => void;
//   destroy: () => void;
// }

export type ReactiveModel<T> = any;

export type GraphMember<T> = {
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

export type Source<T> = {
  [STATE]: T;
  [WATCHERS]: Map<symbol, any>;
  [TRACKED]: [string, symbol][];
};

export type Method<R> = (...args: any[]) => R;

export type Methods = Record<string, Method<unknown>>;

export type Factory<Input, Output> = (context: Input) => Output;

export type Unwrap<T> = NonNullable<{ [K in keyof T]: T[K] }>;

export type Validator<TValue, TState = any> = (
  value: TValue,
  state: TState
) => Record<string, boolean>;

export type SignalDef<TValue, TGraph = any> = {
  [SIGNAL]: TValue;
  [VALIDATORS]?: Validator<TValue>[];
  [DISABLED]?: boolean;
  [SIGNAL_GRAPH]?: TGraph;
};

export type $ValueProps<T> = T extends { [key: string]: unknown }
  ? {
      [Property in keyof T as T[Property] extends $Value<unknown>
        ? Property
        : never]: T[Property];
    }
  : T;

export type $Value<T> = {
  [MODEL_REF]?: ReactiveModel<any>;
  [META_DATA]: SignalDef<any> | SignalDef<any>[];
  [QUERY]?: any;
  [PATH]?: any;
  [FIRST_CHANGE]: boolean;
  [DISABLED]: boolean;
  $value: T;
  $errors: { [key: string]: any };
  $: (callback: (value: T) => void) => void;
} & $ValueProps<T>;

export type ModelObject<T extends { [key: string]: unknown }> = {
  [Property in keyof T]: T[Property] extends SignalDef<
    infer SInner,
    infer SGraph
  >
    ? SInner extends { [key: string]: unknown }
      ? $Value<Unwrap<ModelObject<SInner>>>
      : SInner extends symbol
      ? SGraph extends { [key: string]: unknown }
        ? $Value<Unwrap<ModelObject<SGraph>>>
        : SGraph
      : $Value<SInner extends boolean ? boolean : SInner>
    : T[Property];
};

// SInner = {
//     score: number;
//     isLoading: SignalDef<boolean, unknown>;
//     win: boolean;
// }

// T = {
// player1: SignalDef<{
//     score: number;
//     isLoading: SignalDef<boolean, unknown>;
//     win: boolean;
// }, unknown>;
// player2: SignalDef<{
//     score: number;
//     isLoading: SignalDef<boolean, unknown>;
//     win: boolean;
// };

export type $Model<T = any> = T extends SignalDef<infer M>
  ? M extends { [key: string]: unknown }
    ? $Value<Unwrap<ModelObject<M>>>
    : M
  : T;

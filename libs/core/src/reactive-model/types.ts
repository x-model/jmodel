// import { Unwrap } from '../types';
// import { ReactiveModel } from './reactive-model';

// export const SOURCE = Symbol('SOURCE');
// export const WATCHERS = Symbol('WATCHERS');
// export const STATE = Symbol('STATE');
// export const TRACKED = Symbol('TRACKED');
// export const CALLBACK = Symbol('CALLBACK');
// export const QUERY = Symbol('QUERY');
// export const PATH = Symbol('PATH');
// export const META_DATA = Symbol('META_DATA');
// export const MODEL_REF = Symbol('MODEL_REF');
// export const DISABLED = Symbol('DISABLED');
// export const FIRST_CHANGE = Symbol('FIRST_CHANGE');
// export const TARGET = Symbol('TARGET');
// export const SIGNAL = Symbol('SIGNAL');
// export const SIGNAL_GRAPH = Symbol('SIGNAL_GRAPH');
// export const SIGNAL_VALUE = Symbol('SIGNAL_VALUE');
// export const FROM_SCHEMA = Symbol('FROM_SCHEMA');
// export const VALIDATORS = Symbol('VALIDATORS');
// export const $_ = Symbol('UNSET');
// export const _ = <T>() => $_ as T;

// export type Validator<TValue, TState = any> = (
//   value: TValue,
//   state: TState
// ) => Record<string, boolean>;

// export type SignalDef<TValue, TGraph = any> = {
//   [SIGNAL]: TValue;
//   [VALIDATORS]?: Validator<TValue>[];
//   [DISABLED]?: boolean;
//   [SIGNAL_GRAPH]?: TGraph;
// };

// export type $ValueProps<T> = T extends { [key: string]: unknown }
//   ? {
//       [Property in keyof T as T[Property] extends $Value<unknown>
//         ? Property
//         : never]: T[Property];
//     }
//   : T;

// export type $Value<T> = {
//   [MODEL_REF]?: ReactiveModel<any>;
//   [META_DATA]: SignalDef<any> | SignalDef<any>[];
//   [QUERY]?: any;
//   [PATH]?: any;
//   [FIRST_CHANGE]: boolean;
//   [DISABLED]: boolean;
//   $value: T;
//   $errors: { [key: string]: any };
//   $: (callback: (value: T) => void) => void;
// } & $ValueProps<T>;

// export type ModelObject<T extends { [key: string]: unknown }> = {
//   [Property in keyof T]: T[Property] extends SignalDef<
//     infer SInner,
//     infer SGraph
//   >
//     ? SInner extends { [key: string]: unknown }
//       ? $Value<Unwrap<ModelObject<SInner>>>
//       : SInner extends symbol
//       ? SGraph extends { [key: string]: unknown }
//         ? $Value<Unwrap<ModelObject<SGraph>>>
//         : SGraph
//       : $Value<SInner extends boolean ? boolean : SInner>
//     : T[Property];
// };

// // SInner = {
// //     score: number;
// //     isLoading: SignalDef<boolean, unknown>;
// //     win: boolean;
// // }

// // T = {
// // player1: SignalDef<{
// //     score: number;
// //     isLoading: SignalDef<boolean, unknown>;
// //     win: boolean;
// // }, unknown>;
// // player2: SignalDef<{
// //     score: number;
// //     isLoading: SignalDef<boolean, unknown>;
// //     win: boolean;
// // };

// export type $Model<T> = T extends SignalDef<infer M>
//   ? M extends { [key: string]: unknown }
//     ? $Value<Unwrap<ModelObject<M>>>
//     : M
//   : T;

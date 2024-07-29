import { Unwrap } from '../libs/ng-fragments/src/types';

type isFunction<T> = T extends (...args) => any ? T : never;

type Args<T extends [unknown, unknown]> = T extends [infer I0]
  ? [I0]
  : T extends [infer I0, infer I1]
  ? [I0, I1]
  : T;

function testBuilder<T extends [T[0], T[1]]>(args: Args<T>) {
  return null;
}

testBuilder([
  (context) => ({ test1: 'test' }),
  //   (context) => ({ test: 'test2' }),
]);

// Args<unknown[]> = [() => ({ test: 'test' })]

//       //   ? [(context: C0) => R0, (context: R0) => ReturnType<T[1]>]
//       //   : [...T]

// type ArgResult<T> = T extends ((context?: unknown) => Record<string, unknown>)[]
//   ? T[1] extends undefined
//     ? T[0][]
//     : T[2] extends undefined
//     ? // ? T[0] extends (context: infer C0) => infer R0
//       //   ? [(context: C0) => R0, (context: R0) => ReturnType<T[1]>]
//       //   : [...T]

//       [() => ReturnType<T[0]>, (context: ReturnType<T[0]>) => ReturnType<T[1]>]
//     : T[3] extends undefined
//     ? [
//         () => ReturnType<T[0]>,
//         (context: ReturnType<T[0]>) => ReturnType<T[1]>,
//         (
//           context: Unwrap<ReturnType<T[0]> & ReturnType<T[1]>>
//         ) => ReturnType<T[2]>
//       ]
//     : [...T]
//   : never;

// function newContextBuilder<
//   T extends ((context?: unknown) => Record<string, unknown>)[]
// >(...args: ArgResult<T>): Type<any>;

// function newContextBuilder(...args: any[]): Type<any> {
//   return null;
// }

// const result = newContextBuilder(
//   () => ({ test0: 'sts0' }),
//   (context) => ({ test1: 'sts1' })
//   //   (context) => {
//   //     console.log(context);
//   //     return { tests: 'sts' };
//   //   }
// );

// // v2 niedokończona

// function newContextBuilder<
//   T extends (T[1] extends undefined
//     ? T[0]
//     : T[2] extends undefined
//     ?
//         | (() => ReturnType<isFunction<T[0]>>)
//         | ((
//             context: ReturnType<isFunction<T[0]>>
//           ) => ReturnType<isFunction<T[1]>>)
//     : [...T])[]
// >(...args: ArgResult<T>): Type<any>;

// function newContextBuilder(...args: any[]): Type<any> {
//   return null;
// }

// const result = newContextBuilder(
//   () => ({ test0: 'sts0' }),
//   (context) => ({ test1: 'sts1' })
//   //   (context) => {
//   //     console.log(context);
//   //     return { tests: 'sts' };
//   //   }
// );

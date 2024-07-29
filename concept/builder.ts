// import { Type } from '@angular/core';
// import { props } from '../builder-props/props';
// import {
//   BuildResult,
//   Builder,
//   BuilderInitialContext,
//   BuilderPartialContext,
//   BuilderStepConfig,
// } from '../builder/types';
// import { partialBuilder } from '../builders/partial-builder';
// import { CreationContext, ExecutionContext } from '../fragment/types';
// import { Factory, Unwrap } from '../types';
// import { ngContextBuilder } from '../builders/context-builder';
// import { BuilderBase } from '../builder/build-class';

// const context: CreationContext = {} as CreationContext;

// // const result = modelBuilder({
// //   name: 'cardModel',
// // })((context) => ({ test: 'test' }));

// export function build<
//   InitialContext extends BuilderInitialContext,
//   T1 extends InitialContext & BuilderPartialContext,
//   BuilderResult
// >(
//   builder: (factory: (initialContext: InitialContext) => T1) => BuilderResult,
//   s1: Factory<Unwrap<any>, T1>
// ): BuilderResult {
//   return builder((initialContext) => s1(initialContext) as any);
// }

// const Test = build(
//   // ngContextBuilder()
//   // fragmentTemplateBuilder()
//   // modelBuilder()
//   // repositoryBuilder()
//   // storeBuilder()
//   // builder()
//   partialBuilder(),
//   props(() => ({
//     state: { test: 'test' },
//   }))

//   //   result((context) => context.build<Type<typeof context>>())
// );

// const test = Test.resolve(context);
// console.log(test.state.test);

// // function myBuilderos() {
// //   const builder = {} as ExecutionContext;
// //   build.bind(builder);

// //   return build;
// // }

// // const builder4 = myBuilderos();
// // const result = builder4(
// //   partialBuilder(),
// //   props((context) => ({
// //     state: { test: 'test' },
// //   }))
// // );

// // const config = buildConfig(
// //   abstract<ExecutionContext>(),
// //   props((context) => ({
// //     state: { test: 'test' },
// //   }))
// // );

// // @Injectable()
// // export class PeopleComponentContext extends ngContextBuilder(
// //   build(
// //     abstract<ExecutionContext>(),
// //     fragments({
// //       store$,
// //       totalPages$,
// //       getAll$: peopleGetAll,
// //       get$: peopleGet,
// //     }),
// //     hooks(() => ({
// //       onInit: () => {
// //         console.log('people context initialized');
// //       },
// //       onDestroy: () => {
// //         console.log('people context destroyed');
// //       },
// //     })),
// //     methods(({ _exec, store$ }) => ({
// //       draw: () => _exec(draw$),
// //       getStore: () => _exec(store$),
// //       compare: comparePeople,
// //       map: mapPeople,
// //     }))
// //   ),
// //   {
// //     test: '',
// //   }
// // ) {}

// type Result<T> = T extends [infer Item]
//   ? Unwrap<Item>
//   : T extends [infer Item1, infer Item2]
//   ? Unwrap<Item1 & Item2>
//   : never;

// // type ArgResult<T> = T extends (...args: []) => infer Result ? Result : never;

// // extends [infer Item extends (...args: []) => any]
// //   ? Unwrap<ReturnType<Item>>
// //   : T extends [
// //       infer Item1 extends (...args: []) => any,
// //       infer Item2 extends (...args: []) => any
// //     ]
// //   ? Unwrap<ReturnType<Item1> & ReturnType<Item2>>
// //   : never;

// //   : T extends [
// //       infer Item1 extends (context: infer C1) => infer R1,
// //       infer Item2 extends (context: infer C2) => infer R2
// //     ]
// //   ? [Item1, (context: C1 & R1) => R2]
// //   : never;

// // function newContextBuilder<T extends Record<string, unknown>>(arg: T): Type<T>;

// type isUndefined<T1, PrevR> = T1 extends undefined
//   ? T1
//   : T1 extends (context: infer C0) => infer R0
//   ? (context: PrevR) => R0
//   : never;

// type ArgResult<T> = T extends ((context?: unknown) => Record<string, unknown>)[]
//   ? T[1] extends undefined
//     ? T[0][]
//     : T[2] extends undefined
//     ? [() => ReturnType<T[0]>, (context: ReturnType<T[0]>) => ReturnType<T[1]>]
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

// //   T extends [(context: infer C0) => infer R0]
// //   ? [(context: C0) => R0]

// // T[2] extends (
// //     context: unknown
// //   ) => unknown
// //     ? T extends [(context: infer C0) => infer R0, (context: infer C1) => infer R1]
// //       ? [(context: C0) => R0, (context: R0) => R1]
// //       : never
// //     : T extends [
// //         (context: infer C0) => infer R0,
// //         (context: infer C1) => infer R1,
// //         (context: infer C2) => infer R2
// //       ]
// //     ? [(context: C0) => R0, (context: R0) => R1, (context: R1) => R2]
// //     : never;

// type Args<T extends unknown[]> = T[0] extends number
//   ? [T[0], T[1]]
//   : [T[0], T[1], T[2]];

// function newContextBuilder<T1 extends unknown, T2 extends T1, T3 extends T2>(
//   ...args: Args<[T1, T2, T3]>
// ): Type<any>;

// function newContextBuilder(...args: any[]): Type<any> {
//   return null;
// }

// const result = newContextBuilder(
//   'test',
//   'test2'
//   //   (context) => {
//   //     console.log(context);
//   //     return { tests: 'sts' };
//   //   }
// );

// const myResult = new result();

// const builder: any = null;

// class ComponentContext implements BuilderBase {
//   with(steps: BuilderStepConfig<any, any>[]): any {
//     return null;
//     // return builder((initialContext) =>
//     //   steps.reduce((context, step) => step(context), initialContext)
//     // );
//   }
// }

// const PeopleComponentContext = new ComponentContext().with(
//   //   builderConfig(),
//   //   ngContextBuilder(),
//   props((context) => ({
//     state: { test: 'test' },
//   }))
//   //   props((context) => ({
//   //     state: { test: 'test' },
//   //   }))
// );

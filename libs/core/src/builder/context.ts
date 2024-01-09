import { diDependencies } from '../builder-props/di-dependencies';
import { Hooks } from '../builder-props/hooks';
import { contextBuilder } from '../builders/context-builder';
import { INJECTABLE } from '../di/consts';
import {
  InjectionDef,
  InjectionResult,
  InjectionToken,
  Scope,
} from '../di/types';
import {
  ExecutionContext,
  Fragment,
  FragmentFactory,
  FragmentResultType,
} from '../fragment/types';
import { Unwrap } from '../types';
import { BuilderPartialContext, BuilderStepConfig } from './types';

export const FRAGMENTS = Symbol('FRAGMENTS');
export const DEPENDENCIES = Symbol('DEPENDENCIES');

type FragmentInputType<T> = T extends Fragment<infer TIn, unknown>
  ? TIn
  : never;

export type ModelDependency<
  T extends Record<
    string,
    () => InjectionToken<unknown> | InjectionDef<unknown>
  >
> = {
  [P in keyof T]: InjectionResult<ReturnType<T[P]>>;
};

export type ModelFragment<T> = T extends {
  [FRAGMENTS]: infer F extends Record<
    string,
    FragmentFactory<unknown, unknown>
  >;
}
  ? {
      [P in keyof F]: (
        input?: FragmentInputType<ReturnType<F[P]>>
      ) => FragmentResultType<ReturnType<F[P]>>;
    }
  : never;

export type PublicProps<T> = {
  [P in keyof T as Capitalize<string & P> extends P ? never : P]: T[P];
};

export type Model<T> = T extends {
  [DEPENDENCIES]: unknown;
  [FRAGMENTS]: unknown;
}
  ? Unwrap<ModelDependency<T> & ModelFragment<T>>
  : T extends { [DEPENDENCIES]: unknown }
  ? ModelDependency<T>
  : T extends { [FRAGMENTS]: unknown }
  ? ModelFragment<T>
  : never;

export type PublicModel<
  T extends Record<
    string,
    () => InjectionToken<unknown> | InjectionDef<unknown>
  >
> = Unwrap<PublicProps<ModelDependency<T>>>;

export type Context<T> = (scope: Scope) => PublicProps<T>;

export type BuilderContext = Omit<ExecutionContext, '_exec'>;

export function context<
  Input extends Record<
    string,
    () => InjectionToken<unknown> | InjectionDef<unknown>
  >,
  InputResult extends {
    [P in keyof Input]: InjectionResult<ReturnType<Input[P]>>;
  }
>(s1: Input): Context<InputResult>;
export function context<
  Input extends Record<
    string,
    () => InjectionToken<unknown> | InjectionDef<unknown>
  >,
  T1 extends BuilderPartialContext
>(
  s1: Input,
  s2: BuilderStepConfig<
    {
      [P in keyof Input]: InjectionResult<ReturnType<Input[P]>>;
    } & Unwrap<BuilderContext>,
    T1
  >
): Context<T1>;
// export function context<
//   T1 extends BuilderContext & BuilderPartialContext,
//   T2 extends T1,
//   T3 extends T2
// >(
//   s1: BuilderStepConfig<Unwrap<BuilderContext>, T1>,
//   s2: BuilderStepConfig<Unwrap<T1>, T2>,
//   s3: BuilderStepConfig<Unwrap<T2>, T3>
// ): Context<T3>;
// export function context<
//   T1 extends BuilderContext & BuilderPartialContext,
//   T2 extends T1,
//   T3 extends T2,
//   T4 extends T3
// >(
//   s1: BuilderStepConfig<Unwrap<BuilderContext>, T1>,
//   s2: BuilderStepConfig<Unwrap<T1>, T2>,
//   s3: BuilderStepConfig<Unwrap<T2>, T3>,
//   s4: BuilderStepConfig<Unwrap<T3>, T4>
// ): Context<T4>;
// export function context<
//   T1 extends BuilderContext & BuilderPartialContext,
//   T2 extends T1,
//   T3 extends T2,
//   T4 extends T3,
//   T5 extends T4
// >(
//   s1: BuilderStepConfig<Unwrap<BuilderContext>, T1>,
//   s2: BuilderStepConfig<Unwrap<T1>, T2>,
//   s3: BuilderStepConfig<Unwrap<T2>, T3>,
//   s4: BuilderStepConfig<Unwrap<T3>, T4>,
//   s5: BuilderStepConfig<Unwrap<T4>, T5>
// ): Context<T5>;

export function context<
  Input extends Record<
    string,
    () => InjectionToken<unknown> | InjectionDef<unknown>
  >
>(s1: Input, s2?: any): any {
  const factory = (scope: Scope) => {
    // const container = scope.rootInjector.get(Container);
    const deps = diDependencies(s1);
    const steps = s2 ? [deps, s2] : [deps];

    const result = contextBuilder(scope, (initialContext) =>
      steps.reduce((context, step) => step(context), initialContext)
    ) as ExecutionContext & Hooks;

    if (result?.onInit) {
      result.onInit();
    }

    return result;
  };

  factory[INJECTABLE] = true;

  return factory;
}

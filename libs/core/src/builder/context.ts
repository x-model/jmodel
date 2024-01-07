import { typeBuilder } from '../builders/type-builder';
import { INJECTABLE } from '../di/consts';
import { DiContainer } from '../di/container';
import { InjectionDef, InjectionResult, InjectionToken } from '../di/types';
import {
  ExecutionContext,
  Fragment,
  FragmentFactory,
  FragmentResultType,
  Scope,
} from '../fragment/types';
import { Unwrap } from '../types';
import { BuilderPartialContext, BuilderStepConfig } from './types';

export const FRAGMENTS = Symbol('FRAGMENTS');
export const DEPENDENCIES = Symbol('DEPENDENCIES');

type FragmentInputType<T> = T extends Fragment<infer TIn, unknown>
  ? TIn
  : never;

export type ModelDependency<T> = T extends {
  [DEPENDENCIES]: infer InjectionT extends Record<
    string,
    InjectionToken<unknown> | InjectionDef<unknown>
  >;
}
  ? {
      [P in keyof InjectionT]: InjectionResult<InjectionT[P]>;
    }
  : never;

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

export type PublicModel<T> = Unwrap<PublicProps<Model<T>>>;

export type Context<T> = (scope: Scope) => PublicProps<T>;

export function context<T1 extends ExecutionContext & BuilderPartialContext>(
  s1: BuilderStepConfig<Unwrap<ExecutionContext>, T1>
): Context<T1>;
export function context<
  T1 extends ExecutionContext & BuilderPartialContext,
  T2 extends T1
>(
  s1: BuilderStepConfig<Unwrap<ExecutionContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>
): Context<T2>;
export function context<
  T1 extends ExecutionContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2
>(
  s1: BuilderStepConfig<Unwrap<ExecutionContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>
): Context<T3>;
export function context<
  T1 extends ExecutionContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  T4 extends T3
>(
  s1: BuilderStepConfig<Unwrap<ExecutionContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>,
  s4: BuilderStepConfig<Unwrap<T3>, T4>
): Context<T4>;
export function context<
  T1 extends ExecutionContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  T4 extends T3,
  T5 extends T4
>(
  s1: BuilderStepConfig<Unwrap<ExecutionContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>,
  s4: BuilderStepConfig<Unwrap<T3>, T4>,
  s5: BuilderStepConfig<Unwrap<T4>, T5>
): Context<T5>;

export function context(...steps: BuilderStepConfig<any, any>[]): any {
  const factory = (scope: Scope) => {
    const container = scope.rootInjector.get(DiContainer);

    const result = typeBuilder((initialContext) =>
      steps.reduce((context, step) => step(context), initialContext)
    );

    return new result(scope);
  };

  factory[INJECTABLE] = true;

  return factory;
}

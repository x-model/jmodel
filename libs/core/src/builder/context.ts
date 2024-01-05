import { typeBuilder } from '../builders/type-builder';
import { INJECTABLE } from '../di/consts';
import { DiContainer } from '../di/container';
import { ExecutionContext, Scope } from '../fragment/types';
import { INTERNAL, PUBLIC, Unwrap } from '../types';
import { BuilderPartialContext, BuilderStepConfig } from './types';

export type PublicProps<Internal, Public> = {
  [INTERNAL]: Internal;
  [PUBLIC]: Public;
};

export type Context<T> = (scope: Scope) => T;

export function context<T1 extends ExecutionContext & BuilderPartialContext>(
  s1: BuilderStepConfig<
    Unwrap<ExecutionContext>,
    PublicProps<ExecutionContext, T1>
  >
): Context<T1>;
export function context<
  T1 extends ExecutionContext & BuilderPartialContext,
  T2
>(
  s1: BuilderStepConfig<Unwrap<ExecutionContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, PublicProps<T1, T2>>
): Context<T2>;
export function context<
  T1 extends ExecutionContext & BuilderPartialContext,
  T2 extends T1,
  T3
>(
  s1: BuilderStepConfig<Unwrap<ExecutionContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, PublicProps<T2, T3>>
): Context<T3>;

export function context(...steps: BuilderStepConfig<any, any>[]): any {
  const factory = (scope: Scope) => {
    const container = scope.rootInjector.get(DiContainer);

    const build = typeBuilder() as any;
    const result = build((initialContext) =>
      steps.reduce((context, step) => step(context), initialContext)
    );

    return new result(scope);
  };

  factory[INJECTABLE] = true;

  return factory;
}

import { Unwrap } from '../types';
import {
  BuildResult,
  Builder,
  BuilderInitialContext,
  BuilderPartialContext,
  BuilderStepConfig,
} from './types';

export function build<
  InitialContext extends BuilderInitialContext,
  BuilderResult
>(builder: Builder<InitialContext, BuilderResult>): BuildResult<BuilderResult>;
export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>
): BuildResult<BuilderResult, T1>;
export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  T2 extends T1,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>
): BuildResult<BuilderResult, T2>;
export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>
): BuildResult<BuilderResult, T3>;
export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  T4 extends T3,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>,
  s4: BuilderStepConfig<Unwrap<T3>, T4>
): BuildResult<BuilderResult, T4>;
export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  T4 extends T3,
  T5 extends T4,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>,
  s4: BuilderStepConfig<Unwrap<T3>, T4>,
  s5: BuilderStepConfig<Unwrap<T4>, T5>
): BuildResult<BuilderResult, T5>;

export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  T4 extends T3,
  T5 extends T4,
  T6 extends T5,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>,
  s4: BuilderStepConfig<Unwrap<T3>, T4>,
  s5: BuilderStepConfig<Unwrap<T4>, T5>,
  s6: BuilderStepConfig<Unwrap<T5>, T6>
): BuildResult<BuilderResult, T6>;
export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  T4 extends T3,
  T5 extends T4,
  T6 extends T5,
  T7 extends T6,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>,
  s4: BuilderStepConfig<Unwrap<T3>, T4>,
  s5: BuilderStepConfig<Unwrap<T4>, T5>,
  s6: BuilderStepConfig<Unwrap<T5>, T6>,
  s7: BuilderStepConfig<Unwrap<T6>, T7>
): BuildResult<BuilderResult, T7>;
export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  T4 extends T3,
  T5 extends T4,
  T6 extends T5,
  T7 extends T6,
  T8 extends T7,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>,
  s4: BuilderStepConfig<Unwrap<T3>, T4>,
  s5: BuilderStepConfig<Unwrap<T4>, T5>,
  s6: BuilderStepConfig<Unwrap<T5>, T6>,
  s7: BuilderStepConfig<Unwrap<T6>, T7>,
  s8: BuilderStepConfig<Unwrap<T7>, T8>
): BuildResult<BuilderResult, T8>;
export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  T4 extends T3,
  T5 extends T4,
  T6 extends T5,
  T7 extends T6,
  T8 extends T7,
  T9 extends T8,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>,
  s4: BuilderStepConfig<Unwrap<T3>, T4>,
  s5: BuilderStepConfig<Unwrap<T4>, T5>,
  s6: BuilderStepConfig<Unwrap<T5>, T6>,
  s7: BuilderStepConfig<Unwrap<T6>, T7>,
  s8: BuilderStepConfig<Unwrap<T7>, T8>,
  s9: BuilderStepConfig<Unwrap<T8>, T9>
): BuildResult<BuilderResult, T9>;
export function build<
  InitialContext extends BuilderInitialContext,
  T1 extends InitialContext & BuilderPartialContext,
  T2 extends T1,
  T3 extends T2,
  T4 extends T3,
  T5 extends T4,
  T6 extends T5,
  T7 extends T6,
  T8 extends T7,
  T9 extends T8,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  s1: BuilderStepConfig<Unwrap<InitialContext>, T1>,
  s2: BuilderStepConfig<Unwrap<T1>, T2>,
  s3: BuilderStepConfig<Unwrap<T2>, T3>,
  s4: BuilderStepConfig<Unwrap<T3>, T4>,
  s5: BuilderStepConfig<Unwrap<T4>, T5>,
  s6: BuilderStepConfig<Unwrap<T5>, T6>,
  s7: BuilderStepConfig<Unwrap<T6>, T7>,
  s8: BuilderStepConfig<Unwrap<T7>, T8>,
  s9: BuilderStepConfig<Unwrap<T8>, T9>,
  ...steps: BuilderStepConfig<any, any>[]
): BuildResult<BuilderResult, any>;

export function build<
  InitialContext extends BuilderInitialContext,
  BuilderResult
>(
  builder: Builder<InitialContext, BuilderResult>,
  ...steps: BuilderStepConfig<any, any>[]
): BuilderResult {
  return builder((initialContext) =>
    steps.reduce((context, step) => step(context), initialContext)
  );
}

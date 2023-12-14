import { ProviderToken } from '@angular/core';
import { ExecutionContext } from '../fragment/types';
import { Factory, Unwrap } from '../types';

export type ProviderTokenType<T> = T extends ProviderToken<infer TInner>
  ? TInner
  : T;

export function dependencies<
  Input extends ExecutionContext,
  Output extends Record<string, ProviderToken<unknown>>,
  Result extends {
    [P in keyof Output]: ProviderTokenType<Output[P]>;
  }
>(deps: Output): Factory<Input, Unwrap<Input & Result>> {
  return (context: Input) => {
    const resolvedDeps = Object.keys(deps).reduce(
      (instances, key) => ({
        ...instances,
        [key]: deps[key] && context._inject(deps[key]),
      }),
      {}
    ) as Result;

    return { ...context, ...resolvedDeps };
  };
}

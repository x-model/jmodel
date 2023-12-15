import { runInInjectionContext } from '@angular/core';
import { CreationContext, ExecutionContext } from '../fragment/types';
import { Factory, Unwrap } from '../types';
import { typeBuilder } from '../builders/type-builder';
import { build } from '../builder/build';
import { DiContainer } from '../di/container';
import { props } from './props';
import { ProviderToken } from '../di/types';

export type ProviderTokenType<T> = T extends ProviderToken<infer TInner>
  ? TInner
  : T;

export function diDependencies<
  Input extends ExecutionContext,
  Output extends Record<string, { token; type; resolveFn }>,
  Result extends {
    [P in keyof Output]: ProviderTokenType<ReturnType<Output[P]['resolveFn']>>;
  }
>(deps: Output): Factory<Input, Unwrap<Input & Result>> {
  return (context: Input & CreationContext) => {
    // creation context powinien mieć scope, w sumie mamy contextId
    // skąd brać identyfikator dla scope?
    const scopeId = context._contextId; // Symbol('scope');
    const diContainer = context._inject(DiContainer);

    const resolvedDeps = Object.keys(deps).reduce((instances, key) => {
      const dependency = deps[key];

      const factory = runInInjectionContext(
        context._injector,
        () => () =>
          new (build(
            typeBuilder({ name: 'diDeps' }),
            props(
              (context) =>
                (dependency.resolveFn as any)(context) as ExecutionContext
            )
          ))()
      );

      const instance = diContainer.resolve(dependency as any, factory, {
        id: scopeId,
        injector: context._injector,
      });

      return { ...instances, [key]: instance };
    }, {}) as any;

    return { ...context, ...resolvedDeps };
  };
}

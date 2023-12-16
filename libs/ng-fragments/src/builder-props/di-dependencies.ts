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
    const scopeId = context._scope.id; // Symbol('scope');
    const diContainer = context._inject(DiContainer);

    const resolvedDeps = Object.keys(deps).reduce((instances, key) => {
      const dependency = deps[key];

      const factory = () =>
        new (build(
          typeBuilder({ name: 'diDeps' }),
          props(
            (_context) =>
              (dependency.resolveFn as any)(_context) as ExecutionContext
          )
        ))(context._scope);

      const instance = diContainer.resolve(dependency as any, factory, {
        id: scopeId,
      });

      return { ...instances, [key]: instance };
    }, {}) as any;

    return { ...context, ...resolvedDeps };
  };
}

import { CreationContext, ExecutionContext } from '../fragment/types';
import { Factory, Unwrap } from '../types';
import { DiContainer } from '../di/container';
import { ProviderToken } from '../di/types';
import { INJECTABLE, InjectionToken } from '../di/consts';

export type ProviderTokenType<T> = T extends ProviderToken<infer TInner>
  ? TInner
  : T;

export function diDependencies2<
  Input extends ExecutionContext,
  Output extends Record<
    string,
    { token: InjectionToken<unknown>; type; resolveFn }
  >,
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

      const factory = () => {
        const resolved = dependency.resolveFn();
        if (typeof resolved === 'function' && resolved[INJECTABLE]) {
          return resolved(context._scope);
        }
        return resolved;
      };

      const instance = diContainer.resolve(
        { ...dependency, token: dependency.token.token } as any,
        factory,
        {
          id: scopeId,
        }
      );

      return { ...instances, [key]: instance };
    }, {}) as any;

    return { ...context, ...resolvedDeps };
  };
}

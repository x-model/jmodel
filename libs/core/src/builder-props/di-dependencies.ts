import { CreationContext, ExecutionContext } from '../fragment/types';
import { Factory, Unwrap } from '../types';
import { DiContainer } from '../di/container';
import { InjectionToken } from '../di/consts';

export type InjectionTokenType<T> = T extends InjectionToken<infer TInner>
  ? TInner
  : T;

export function diDependencies<
  Input extends ExecutionContext,
  Output extends Record<string, InjectionToken<unknown>>,
  Result extends {
    [P in keyof Output]: InjectionTokenType<Output[P]>;
  }
>(deps: Output): Factory<Input, Unwrap<Input & Result>> {
  return (context: Input & CreationContext) => {
    // creation context powinien mieć scope, w sumie mamy contextId
    // skąd brać identyfikator dla scope?
    const scopeId = context._scope.id; // Symbol('scope');
    const diContainer = context._inject(DiContainer);

    const resolvedDeps = Object.keys(deps).reduce((instances, key) => {
      const dependency = deps[key];

      const instance = diContainer.resolveByToken(dependency.token, {
        id: scopeId,
      });

      return { ...instances, [key]: instance };
    }, {}) as any;

    return { ...context, ...resolvedDeps };
  };
}

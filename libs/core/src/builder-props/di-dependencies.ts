import { CreationContext, ExecutionContext } from '../fragment/types';
import { Factory, Unwrap } from '../types';
import { Container, containerToken } from '../di/container';
import { INJECTABLE } from '../di/consts';
import { InjectionDef, InjectionResult, InjectionToken } from '../di/types';

export function diDependencies<
  Input extends ExecutionContext,
  Output extends Record<
    string,
    InjectionToken<unknown> | InjectionDef<unknown>
  >,
  Result extends {
    [P in keyof Output]: InjectionResult<Output[P]>;
  }
>(deps: Output): Factory<Input, Unwrap<Input & Result>> {
  return (context: Input & CreationContext) => {
    // creation context powinien mieć scope, w sumie mamy contextId
    // skąd brać identyfikator dla scope?
    const scope = context._scope;
    const scopeId = context._scope.id; // Symbol('scope');
    const container = context._inject<Container>(containerToken as any);

    // if (Array.isArray(deps)) {
    //   deps.forEach((item) => {
    //     let provider: {
    //       token: InjectionToken<unknown>;
    //       lifetime: Lifetime;
    //       resolveFn: any;
    //     };

    //     // if (Array.isArray(item) && item.length === 2) {
    //     //   provider = {
    //     //     token: item[0].token,
    //     //     type: null,
    //     //     resolveFn: item[1],
    //     //   };
    //     // } else {

    //     // }

    //     provider = item;

    //     const factory = () => {
    //       const resolved = provider.resolveFn();
    //       if (typeof resolved === 'function' && resolved[INJECTABLE]) {
    //         return resolved(scope);
    //       }
    //       return resolved;
    //     };

    //     container.resolve(provider as any, factory, {
    //       id: scopeId,
    //     });
    //   });

    //   return context;
    // }

    const resolvedDeps = Object.keys(deps).reduce((instances, key) => {
      const dependency = deps[key];
      let instance;

      if (dependency.hasOwnProperty('resolveFn')) {
        const dep = dependency as InjectionDef<unknown>;

        const factory = () => {
          const resolved = dep.resolveFn();
          if (typeof resolved === 'function' && resolved[INJECTABLE]) {
            return resolved(scope);
          }
          return resolved;
        };

        instance = container.resolve(dep, factory, {
          id: scopeId,
        });
      } else {
        const dep = dependency as InjectionToken<unknown>;

        instance = container.resolveByToken(dep, {
          id: scopeId,
        });
      }

      return { ...instances, [key]: instance };
    }, {}) as any;

    return { ...context, ...resolvedDeps };
  };
}

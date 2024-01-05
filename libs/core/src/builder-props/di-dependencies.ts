import { CreationContext, ExecutionContext } from '../fragment/types';
import { Factory, Unwrap } from '../types';
import { DiContainer } from '../di/container';
import { INJECTABLE, InjectionToken } from '../di/consts';

export type InjectionTokenType<T> = T extends InjectionToken<infer TInner>
  ? TInner
  : T;

export type InjectionDef<T> = {
  token: InjectionToken<T>;
  type;
  resolveFn;
};

export type InjectionResult<T> = T extends InjectionToken<infer IType>
  ? IType
  : T extends InjectionDef<infer IDef>
  ? IDef
  : never;

export function diDependencies<
  Input extends ExecutionContext,
  Output extends
    | Record<string, InjectionToken<unknown> | InjectionDef<unknown>>
    | InjectionDef<unknown>[],
  Result extends {
    [P in keyof Output]: InjectionResult<Output[P]>;
  }
>(deps: Output): Factory<Input, Unwrap<Input & Result>> {
  return (context: Input & CreationContext) => {
    // creation context powinien mieć scope, w sumie mamy contextId
    // skąd brać identyfikator dla scope?
    const scope = context._scope;
    const scopeId = context._scope.id; // Symbol('scope');
    const diContainer = context._inject(DiContainer);

    if (Array.isArray(deps)) {
      deps.forEach((item) => {
        let provider: {
          token: any;
          type: any;
          resolveFn: any;
        };

        if (Array.isArray(item) && item.length === 2) {
          provider = {
            token: item[0].token,
            type: null,
            resolveFn: item[1],
          };
        } else {
          provider = { ...item, token: item.token.token };
        }

        const factory = () => {
          const resolved = provider.resolveFn();
          if (typeof resolved === 'function' && resolved[INJECTABLE]) {
            return resolved(scope);
          }
          return resolved;
        };

        diContainer.resolve(provider as any, factory, {
          id: scopeId,
        });
      });

      return context;
    }

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

        instance = diContainer.resolve(
          { ...dep, token: dep.token.token } as any,
          factory,
          {
            id: scopeId,
          }
        );
      } else {
        instance = diContainer.resolveByToken(dependency.token, {
          id: scopeId,
        });
      }

      return { ...instances, [key]: instance };
    }, {}) as any;

    return { ...context, ...resolvedDeps };
  };
}

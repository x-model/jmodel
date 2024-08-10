import { Context, CreationContext } from '../fragment/types';
import { Factory, Unwrap } from '../types';
import { Container, containerToken } from '../di/container';
import { FACTORY, LIFETIME, PROVIDERS, TOKEN } from '../di/consts';
import { InjectionDef, InjectionResult } from '../di/types';
import { Lifetime } from '../di/lifetime';

export function diDependencies<
  Dependencies extends Record<string, InjectionDef<unknown>>,
  Result extends {
    [P in keyof Dependencies]: InjectionResult<Dependencies[P]>;
  }
>(deps: Dependencies): Factory<CreationContext, Unwrap<Context & Result>> {
  return (context: Context & CreationContext) => {
    // creation context powinien mieć scope, w sumie mamy contextId
    // skąd brać identyfikator dla scope?
    const scope = context._scope;
    const scopeId = context._scope.id; // Symbol('scope');
    const container: Container = context.inject(containerToken as any);

    const resolvedDeps = Object.keys(deps).reduce((instances, key) => {
      // dodać obsługę [PROVIDERS]
      const dependency = deps[key];
      resolveProviders(container, context, dependency[PROVIDERS]);

      let onInitHook = (context) => {};

      const onInit: (fn: (context) => void) => void = (fn) => (onInitHook = fn);

      const factory = () => ({
        inject: context.inject,
        execute: context.execute,
        ...dependency[FACTORY](context, { onInit }),
      }); // scope, { _inject: context.inject });

      const instance = container.resolve(dependency, factory, {
        id: scopeId,
      });

      if (onInitHook && typeof onInitHook === 'function') {
        onInitHook(context);
      }

      return { ...instances, [key]: instance };
    }, {}) as any;

    return { ...context, ...resolvedDeps };
  };
}

const resolveProviders = (container, context, providers: any) => {
  const scope = context._scope;
  const scopeId = context._scope.id;

  Reflect.ownKeys(providers).forEach((key) => {
    let dependency;

    if (typeof providers[key] === 'function') {
      dependency = {
        [TOKEN]: key,
        [LIFETIME]: Lifetime.scoped,
        [FACTORY]: providers[key],
      };
    } else {
      dependency = {
        ...providers[key],
        [TOKEN]: key,
      };

      if (Reflect.ownKeys(providers[key]).includes(PROVIDERS)) {
        resolveProviders(container, context, providers[key]);
      }
    }

    const factory = () => dependency[FACTORY](context); // scope, { _inject: context.inject });

    container.register(dependency, factory, scopeId);
  });
};

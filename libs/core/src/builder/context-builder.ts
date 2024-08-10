import { Factory } from '../types';
import { ProviderToken, Scope } from '../di/types';
import { Token, injectionToken } from '../di/consts';
import { Context, CreationContext } from './types';

export const contextToken = injectionToken('context');

export type BuilderPartialContext = Record<string, unknown>;

export function contextBuilder<FactoryResult extends BuilderPartialContext>(
  scope: Scope,
  factory: Factory<Context, FactoryResult>,
  name?: string
): Context {
  const _id = Symbol('CONTEXT_ID');
  let _innerContext: FactoryResult = {} as any;
  let _executionContext: Context;

  const inject = <T extends Token<unknown>>(token: T): T['_'] => {
    if (token === (contextToken as any)) {
      return _innerContext as any;
    }
    return scope.inject(token as any);
  };

  const execute = (fn: (...args: any[]) => unknown, ...params): any => {
    return fn.call(this, ...params);
  };

  _executionContext = {
    execute,
    inject,
  };

  const _creationContext: Partial<CreationContext> = {
    _contextId: _id,
    ..._executionContext,
  };

  // CONTEXT CREATION
  const contextFactory = {
    ..._creationContext,
    _injector: {
      get: <T>(token: ProviderToken<T>) => inject(token as any) as T,
    },
    _scope: scope,
  } as CreationContext;

  const config = factory(contextFactory) as FactoryResult & CreationContext;
  let publicProps;

  Object.keys(config as any).forEach((key) => {
    publicProps = { ...publicProps, [key]: config[key] };
  });

  const publicContext = getInnerContext<FactoryResult & CreationContext>(
    publicProps,
    contextFactory
  );

  let context = {
    _id,
    _contextName: name,
    inject,
    execute,
  };

  for (const key in publicContext) {
    // do każdego value podpinać jakoś name (key), wtedy możemy tego używać do logs

    Object.defineProperty(context, key, {
      value: publicContext[key],
      // writable: false,
    });
  }

  return context;
}

function getInnerContext<
  Context extends BuilderPartialContext & CreationContext
>(
  context: Context,
  creationContext: CreationContext
): Exclude<Context, CreationContext> {
  const toExclude = Object.keys(creationContext);

  return Object.keys(context).reduce(
    (result, key) =>
      toExclude.includes(key) ? result : { ...result, [key]: context[key] },
    {}
  ) as Exclude<Context, CreationContext>;
}

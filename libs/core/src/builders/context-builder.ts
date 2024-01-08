import { CreationContext, ExecutionContext, Fragment } from '../fragment/types';
import { BuilderPartialContext } from '../builder/types';
import { Factory } from '../types';
import { ProviderToken, Scope } from '../di/types';

export function contextBuilder<FactoryResult extends BuilderPartialContext>(
  scope: Scope,
  factory: Factory<ExecutionContext, FactoryResult>,
  name?: string
): ExecutionContext {
  const _id = Symbol('CONTEXT_ID');
  let _innerContext: FactoryResult;
  let _executionContext: ExecutionContext;

  const _inject = <T>(token: ProviderToken<T>): T => {
    return scope.inject(token as any);
  };

  const _exec = <TFragmentIn, TFragmentOut>(
    fragment: Fragment<TFragmentIn, TFragmentOut>,
    input?: TFragmentIn
  ): TFragmentOut => {
    return fragment({
      ..._executionContext,
      ..._innerContext,
      _input: input,
    });
  };

  _executionContext = {
    _exec,
    _inject,
  };

  const _creationContext: Partial<CreationContext> = {
    _contextId: _id,
    ..._executionContext,
  };

  // CONTEXT CREATION
  const contextFactory = {
    ..._creationContext,
    _injector: {
      get: <T>(token: ProviderToken<T>) => _inject(token as any) as T,
    },
    _scope: scope,
  } as CreationContext;

  const config = factory(contextFactory) as FactoryResult & CreationContext;
  let internalProps;
  let publicProps;

  Object.keys(config as any).forEach((key) => {
    if (key.startsWith('_')) {
      internalProps = {
        ...internalProps,
        [key.replace(/^_/, '')]: config[key],
      };
    } else {
      publicProps = { ...publicProps, [key]: config[key] };
    }
  });

  _innerContext = getInnerContext<FactoryResult & CreationContext>(
    internalProps,
    contextFactory
  );

  const publicContext = getInnerContext<FactoryResult & CreationContext>(
    publicProps,
    contextFactory
  );

  let context = {
    _id,
    _contextName: name,
    _inject,
    _exec,
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

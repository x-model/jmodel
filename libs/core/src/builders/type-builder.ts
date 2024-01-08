import { CreationContext, ExecutionContext, Fragment } from '../fragment/types';
import { BuilderPartialContext } from '../builder/types';
import { Hooks } from '../builder-props/hooks';
import { Factory } from '../types';
import { ProviderToken, Scope, Type } from '../di/types';

export type ContentType<T> = T extends Type<infer TInner> ? TInner : T;

export function typeBuilder<FactoryResult extends BuilderPartialContext>(
  factory: Factory<ExecutionContext, FactoryResult>,
  name?: string
): Type<ExecutionContext> {
  class Context implements ExecutionContext {
    _contextName = name;
    // Symbol(builderConfig?.name || 'CONTEXT_ID')
    // Ułatwi potem debugowanie
    _id = Symbol('CONTEXT_ID');
    /**
     * prevents to use context during creation process
     */
    _created = false;
    _innerContext: FactoryResult;
    _executionContext: ExecutionContext = {
      _exec: (fragment, input?) => this._exec(fragment, input),
      _inject: (token) => this._inject(token),
    };
    _creationContext: Partial<CreationContext> = {
      _contextId: this._id,
      ...this._executionContext,
    };

    constructor(private readonly _scope: Scope) {
      const context = {
        ...this._creationContext,
        _injector: {
          get: <T>(token: ProviderToken<T>) =>
            this._scope.inject(token as any) as T,
        },
        _scope: this._scope,
      } as CreationContext;

      const config = factory(context) as FactoryResult & CreationContext;
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

      this._innerContext = getInnerContext<FactoryResult & CreationContext>(
        internalProps,
        context
      );

      const publicContext = getInnerContext<FactoryResult & CreationContext>(
        publicProps,
        context
      );

      for (const key in publicContext) {
        // do każdego value podpinać jakoś name (key), wtedy możemy tego używać do logs

        Object.defineProperty(this, key, {
          value: publicContext[key],
          // writable: false,
        });
      }

      this._created = true;

      registerHooks(publicContext as Hooks);
    }

    _inject<T>(token: ProviderToken<T>): T {
      return this._scope.inject(token as any);
    }

    _exec<TFragmentIn, TFragmentOut>(
      fragmentOrFactory: // | FragmentFactory<TFragmentIn, TFragmentOut>
      Fragment<TFragmentIn, TFragmentOut>,
      input?: TFragmentIn
    ): TFragmentOut {
      let context = {};

      if (!this._created) {
        console.warn('Cannot use context during creation');
      } else {
        context = {
          ...this._innerContext,
        };
      }

      const fragmentInstance = fragmentOrFactory;
      // const fragmentInstance = resolveFragment(fragmentOrFactory, {
      //   contextId: this._id,
      //   injector: {
      //     get: <T>(token: ProviderToken<T>) =>
      //       this._scope.inject(token as any) as T,
      //   },
      // });

      // if (!fragmentInstance) {
      //   throw new Error('Cannot resolve fragment');
      // }

      // we don't have to run this from injectionContext, because developer should use context._inject method
      return fragmentInstance({
        ...this._executionContext,
        ...context,
        _input: input,
      });
    }
  }

  return Context;
}

function registerHooks(hooks: Hooks): void {
  if (hooks.onInit) {
    hooks.onInit();
  }

  // if (hooks.onDestroy && injector) {
  //   injector.get(DestroyRef).onDestroy(() => {
  //     hooks.onDestroy();
  //   });
  // }
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

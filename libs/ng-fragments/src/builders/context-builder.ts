import {
  DestroyRef,
  Injectable,
  Injector,
  ProviderToken,
  inject,
  EnvironmentInjector,
} from '@angular/core';
import {
  CreationContext,
  ExecutionContext,
  Fragment,
  FragmentFactory,
  Builder,
  BuilderPartialContext,
  Hooks,
  Factory,
  Container,
  Type,
  resolveFragment,
} from '@web-fragments/core';

export type ContentType<T> = T extends Type<infer TInner> ? TInner : T;

export type ContextType<T> = ContentType<T>;

export type BuilderConfig = {
  providedIn?: 'root';
  name?: string;
};

export function ngContextBuilder(
  builderConfig?: BuilderConfig
): Builder<ExecutionContext, Type<ExecutionContext>> {
  return function <FactoryResult extends BuilderPartialContext>(
    factory: Factory<ExecutionContext, FactoryResult>
  ): Type<ExecutionContext> {
    @Injectable({ providedIn: builderConfig?.providedIn })
    // TODO Rename
    class Context implements ExecutionContext {
      _contextName = builderConfig?.name;
      _injector = inject(Injector);
      _rootInjector = inject(EnvironmentInjector);
      _container = inject(Container);
      // Symbol(builderConfig?.name || 'CONTEXT_ID')
      // Ułatwi potem debugowanie
      _id = Symbol('CONTEXT_ID');
      /**
       * prevents to use context during creation process
       */
      _created = false;
      _innerContext: FactoryResult;
      _scope = this._container.createScope();
      _executionContext: ExecutionContext = {
        _exec: (fragment, input?) => this._exec(fragment, input),
        _inject: (token) => this._inject(token),
      };
      _creationContext: CreationContext = {
        _contextId: this._id,
        _injector: this._injector,
        _scope: this._scope,
        ...this._executionContext,
      };

      constructor() {
        this._injector
          .get(DestroyRef)
          .onDestroy(() => this._container.destroyScope(this._scope.id));

        const config = factory(this._creationContext) as FactoryResult &
          CreationContext;

        this._innerContext = getInnerContext<FactoryResult & CreationContext>(
          config,
          this._creationContext
        );

        for (const key in this._innerContext) {
          // do każdego value podpinać jakoś name (key), wtedy możemy tego używać do logs

          Object.defineProperty(this, key, {
            value: this._innerContext[key],
            writable: false,
          });
        }

        this._created = true;

        registerHooks(this._innerContext as Hooks, this._injector);
      }

      _inject<T>(token: ProviderToken<T>): T {
        return this._scope.inject(token as any);
      }

      _exec<TFragmentIn, TFragmentOut>(
        fragmentOrFactory:
          | FragmentFactory<TFragmentIn, TFragmentOut>
          | Fragment<TFragmentIn, TFragmentOut>,
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
        const fragmentInstance = resolveFragment(fragmentOrFactory, {
          contextId: this._id,
          injector: this._injector,
        });

        if (!fragmentInstance) {
          throw new Error('Cannot resolve fragment');
        }

        // At this moment we can't execute registered fragment from different context directly,
        // instead in context we can create method and execute this fragment from different context using this method
        if (fragmentInstance.creationContext.contextId !== this._id) {
          throw new Error(
            'Cannot execute registered fragment from different context'
          );
        }

        // we don't have to run this from injectionContext, because developer should use context._inject method
        return fragmentInstance.execute({
          ...this._executionContext,
          ...context,
          _input: input,
        });
      }
    }

    return Context;
  };
}

function registerHooks(hooks: Hooks, injector: Injector): void {
  if (hooks.onInit) {
    hooks.onInit();
  }

  if (hooks.onDestroy && injector) {
    this._injector.get(DestroyRef).onDestroy(() => hooks.onDestroy());
  }
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

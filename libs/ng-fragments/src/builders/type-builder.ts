import {
  DestroyRef,
  Injectable,
  Injector,
  ProviderToken,
  Type,
  inject,
  runInInjectionContext,
} from '@angular/core';
import {
  CreationContext,
  ExecutionContext,
  Fragment,
  FragmentFactory,
} from '../fragment/types';
import { TemplateRegistry } from '../fragment/template-registry';
import { Builder, BuilderPartialContext } from '../builder/types';
import { resolveFragment } from '../fragment/resolver';
import { Hooks } from '../builder-props/hooks';
import { Factory } from '../types';

export type ContentType<T> = T extends Type<infer TInner> ? TInner : T;

export type BuilderConfig = {
  providedIn: 'root';
};

export function typeBuilder(
  builderConfig?: BuilderConfig
): Builder<ExecutionContext, Type<ExecutionContext>> {
  return function <FactoryResult extends BuilderPartialContext>(
    factory: Factory<ExecutionContext, FactoryResult>
  ): Type<ExecutionContext> {
    @Injectable({ providedIn: builderConfig?.providedIn })
    // TODO Rename
    class Context implements ExecutionContext {
      _injector = inject(Injector);
      _id = Symbol('CONTEXT_ID');
      /**
       * prevents to use context during creation process
       */
      _created = false;
      _templateRegistry = new TemplateRegistry();
      _innerContext: FactoryResult;
      _executionContext: ExecutionContext = {
        _exec: (fragment, input?) => this._exec(fragment, input),
        _inject: (token) => this._inject(token),
      };
      _creationContext: CreationContext = {
        _contextId: this._id,
        _injector: this._injector,
        _templateRegistry: this._templateRegistry,
        ...this._executionContext,
      };

      constructor() {
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
        return this._injector.get(token);
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
        const fragmentInstance = resolveFragment(
          fragmentOrFactory,
          this._templateRegistry,
          {
            contextId: this._id,
            injector: this._injector,
          }
        );

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
    runInInjectionContext(injector, () => {
      inject(DestroyRef).onDestroy(() => {
        hooks.onDestroy();
      });
    });
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

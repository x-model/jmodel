import {
  DestroyRef,
  Injector,
  inject,
  EnvironmentInjector,
} from '@angular/core';
import {
  CreationContext,
  BuilderPartialContext,
  Factory,
  Container,
  Type,
  Context,
  Token,
} from '@web-fragments/core';

export type ContentType<T> = T extends Type<infer TInner> ? TInner : T;

export type ContextType<T> = ContentType<T>;

export type BuilderConfig = {
  providedIn?: 'root';
  name?: string;
};

export function ngContextBuilder<FactoryResult extends Record<string, unknown>>(
  factory: Factory<CreationContext, FactoryResult>
): Type<Context> {
  class CONTEXT implements Context {
    _injector = inject(Injector);
    _rootInjector = inject(EnvironmentInjector);
    _container = inject(Container);
    // Symbol(builderConfig?.name || 'CONTEXT_ID')
    // Ułatwi potem debugowanie
    _id = Symbol('CONTEXT_ID');
    /**
     * prevents to use context during creation process
     */
    _innerContext: FactoryResult;
    _scope = this._container.createScope();

    _creationContext: CreationContext = {
      _contextId: this._id,
      _injector: this._injector,
      _scope: this._scope,
      execute: (fn, ...args) => this.execute(fn, ...args),
      inject: (token) => this.inject<any>(token),
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
    }

    inject<T extends Token<unknown>>(token: T): T['_'] {
      return this._scope.inject(token as any);
    }

    execute(fn: (...args: any[]) => unknown, ...params): any {
      return fn.call(this, ...params);
    }
  }

  return CONTEXT;
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

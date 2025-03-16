import {
  DestroyRef,
  Injector,
  inject,
  EnvironmentInjector,
} from '@angular/core';
import {
  Container,
  Type,
  Context,
  Token,
  diDependencies,
  CreationContext,
} from '@web-fragments/core';

export type BuilderPartialContext = Record<string, unknown>;

export function ngContextBuilder<BuilderModel extends Record<string, unknown>>(
  model: BuilderModel
): Type<Context> {
  class CONTEXT implements Context {
    _injector = inject(Injector);
    _rootInjector = inject(EnvironmentInjector);
    _container = inject(Container);
    _id = Symbol('CONTEXT_ID');
    /**
     * prevents to use context during creation process
     */
    _innerContext: BuilderModel;
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

      const config = diDependencies(model)(
        this._creationContext
      ) as BuilderModel & CreationContext;

      this._innerContext = getInnerContext<BuilderModel & CreationContext>(
        config,
        this._creationContext
      );

      for (const key in this._innerContext) {
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

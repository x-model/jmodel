import {
  Injectable,
  inject,
  EnvironmentInjector,
  Injector,
  DestroyRef,
} from '@angular/core';

// być może każdy framework/biblioteka musi mieć własną implementację swojego kontenera,
// ale też fajnie byłoby mieć jakiś bazowy kod
@Injectable({ providedIn: 'root' })
export class DiContainer {
  private readonly _rootScope = Symbol('root');
  private readonly _rootInjector = inject(EnvironmentInjector);
  private instances: Map<symbol, Map<symbol, any>> = new Map();

  resolve(
    value: { token; type: 'singleInstance'; resolveFn },
    factory: any,
    scope?: { id: symbol; injector: Injector }
  ) {
    if (!value.token) {
      throw new Error('It is not injectable');
    }

    const { id, injector } = this.getScope(value, scope);

    if (!this.instances.has(id)) {
      this.register(value, factory, { id, injector });
    }

    const instance = this.instances.get(id).get(value.token);

    if (!instance) {
      this.register(value, factory, { id, injector });
    }

    return this.instances.get(id).get(value.token).value;
  }

  private getScope(
    value: { token; type: 'singleInstance'; resolveFn },
    scope?: { id: symbol; injector: Injector }
  ) {
    let resolvedScope;

    if (value.type === 'singleInstance') {
      resolvedScope = { id: this._rootScope, injector: this._rootInjector };
    } else if (!scope.id || !scope.injector) {
      throw new Error('Scope is missing');
    } else {
      resolvedScope = scope;
    }

    return resolvedScope;
  }

  private register(
    value: { token; type: 'singleInstance'; resolveFn },
    factory: any,
    scope: { id: symbol; injector?: Injector }
  ) {
    const scopeMap = this.instances.get(scope.id);

    if (!scopeMap) {
      this.instances.set(
        scope.id,
        new Map([[value.token, { value: factory(), injector: scope.injector }]])
      );

      console.log('DI: Registered', value.resolveFn.name);

      scope.injector.get(DestroyRef).onDestroy(() => {
        this.unregister(value, scope);
      });
    } else {
      if (scopeMap.has(value.token)) {
        throw new Error('This object is already registered');
      }

      scopeMap.set(value.token, {
        value: factory(),
        injector: scope.injector,
      });
      console.log('DI: Registered', value.resolveFn.name);

      scope.injector.get(DestroyRef).onDestroy(() => {
        this.unregister(value, scope);
      });
    }
  }

  private unregister(
    value: { token; type: 'singleInstance'; resolveFn },
    scope: { id: symbol; injector?: Injector }
  ) {
    console.log('destroyed', value.resolveFn.name);
    this.instances.get(scope.id).delete(value.token);

    if (this.instances.get(scope.id).size === 0) {
      this.instances.delete(scope.id);
    }
  }
}

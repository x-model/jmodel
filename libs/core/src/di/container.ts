import { Injector } from './types';
import { Scope, ScopeOptions } from '../fragment/types';

// być może każdy framework/biblioteka musi mieć własną implementację swojego kontenera,
// ale też fajnie byłoby mieć jakiś bazowy kod
export class DiContainer {
  private readonly _rootScope = Symbol('root');
  private registrations: Map<symbol, Map<symbol, any>> = new Map();
  private scopes: Map<symbol, Scope> = new Map();

  constructor(private readonly _rootInjector: Injector) {}

  resolve(
    value: { token; type: 'singleInstance'; resolveFn },
    factory: any,
    scope?: { id: symbol }
  ) {
    if (!value.token) {
      throw new Error('It is not injectable');
    }

    const { id, injector } = this.getScope(value, scope);

    if (!this.registrations.has(id)) {
      this.register(value, factory, { id, injector });
    }

    const instance = this.registrations.get(id).get(value.token);

    if (!instance) {
      this.register(value, factory, { id, injector });
    }

    return this.registrations.get(id).get(value.token).value;
  }

  createScope(options: ScopeOptions): Scope {
    const scope = {
      id: Symbol('SCOPE_ID'),
      ...options,
    } as Scope;

    this.scopes.set(scope.id, scope);

    return scope;
  }

  destroyScope(scopeId: symbol): void {
    console.log('destroying scope');
    const instances = this.registrations.get(scopeId);
    instances.forEach(
      (instance) => instance.value.onDestroy && instance.value.onDestroy()
    );

    const scope = this.scopes.get(scopeId);
    scope.localInjector = null;
    scope.rootInjector = null;
    this.scopes.delete(scopeId);
  }

  private getScope(
    value: { token; type: 'singleInstance'; resolveFn },
    scope: { id: symbol }
  ) {
    let resolvedScope;

    if (value.type === 'singleInstance') {
      resolvedScope = { id: this._rootScope, injector: this._rootInjector };
    } else if (!scope.id) {
      throw new Error('Scope is missing');
    } else {
      const _scope = this.scopes.get(scope.id);
      resolvedScope = { id: _scope.id, injector: _scope.localInjector };
    }

    return resolvedScope;
  }

  private register(
    value: { token; type: 'singleInstance'; resolveFn },
    factory: any,
    scope: { id: symbol; injector?: Injector }
  ) {
    const scopeMap = this.registrations.get(scope.id);

    if (!scopeMap) {
      this.registrations.set(
        scope.id,
        new Map([[value.token, { value: factory(), injector: scope.injector }]])
      );

      console.log('DI: Registered', value.resolveFn.name);
    } else {
      if (scopeMap.has(value.token)) {
        throw new Error('This object is already registered');
      }

      scopeMap.set(value.token, {
        value: factory(),
        injector: scope.injector,
      });

      console.log('DI: Registered', value.resolveFn.name);
    }

    const _scope = this.scopes.get(scope.id);

    _scope.onRelease(() => {
      this.unregister(value, scope);
    });
  }

  private unregister(
    value: { token; type: 'singleInstance'; resolveFn },
    scope: { id: symbol; injector?: Injector }
  ) {
    console.log('destroyed', value.resolveFn.name);
    this.registrations.get(scope.id).delete(value.token);

    if (this.registrations.get(scope.id).size === 0) {
      this.registrations.delete(scope.id);
    }
  }
}

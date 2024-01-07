import { injectionToken } from './consts';
import { Lifetime } from './lifetime';
import { InjectionDef, InjectionToken, ManagedScope } from './types';
import { Scope, ScopeOptions } from './types';

const ROOT_SCOPE = Symbol('ROOT_SCOPE');
export const containerToken = injectionToken('container');

export type ScopeInfo = {
  id: symbol;
  parentId?: symbol;
};

// być może każdy framework/biblioteka musi mieć własną implementację swojego kontenera,
// ale też fajnie byłoby mieć jakiś bazowy kod
export class Container {
  // private readonly _rootScope = Symbol('root');
  private registrations: Map<symbol, Map<symbol, any>> = new Map();
  private scopes: Map<symbol, ManagedScope> = new Map();
  private parents: [symbol, symbol][] = [];

  constructor() {
    this.createRootScope();
  }

  resolveByToken<T>(token: InjectionToken<T>, scopeInfo?: ScopeInfo) {
    if (!token) {
      throw new Error('It is not injectable');
    }

    if (!scopeInfo?.id) {
      throw new Error('Scope is missing');
    }

    const { id } = this.getScope(scopeInfo.id);

    if (!this.registrations.has(id)) {
      throw new Error('Cannot resolve. Provider not exists');
    }

    return this.registrations.get(id).get(token.token).value;
  }

  resolve<T>(
    injectionDef: InjectionDef<T>,
    factory: any,
    scopeInfo?: ScopeInfo
  ) {
    if (!injectionDef.token) {
      throw new Error('It is not injectable');
    }

    const scopeId =
      injectionDef?.lifetime === Lifetime.singleton
        ? ROOT_SCOPE
        : scopeInfo?.id;

    const { id } = this.getScope(scopeId);

    if (!this.registrations.has(id)) {
      this.register(injectionDef, factory, id);
    }

    const instance = this.registrations.get(id).get(injectionDef.token.token);

    if (!instance) {
      this.register(injectionDef, factory, id);
    }

    return this.registrations.get(id).get(injectionDef.token.token).value;
  }

  getDependency<T>(token: symbol, scopeId: symbol, scopeParentId?: symbol): T {
    if (!this.registrations.has(scopeId)) {
      throw new Error('Injection scope not exists');
    }

    if (!this.registrations.get(scopeId).has(token)) {
      throw new Error('No dependency for provided token');
    }

    return this.registrations.get(scopeId).get(token).value;
  }

  createScope(options?: ScopeOptions): Scope {
    const scope = this.createNewScope(undefined, options);
    return scope;
  }

  destroyScope(scopeId: symbol): void {
    console.log('destroying scope');
    const instances = this.registrations.get(scopeId);
    instances.forEach(
      (instance) => instance.value.onDestroy && instance.value.onDestroy()
    );

    this.registrations.delete(scopeId);

    const scope = this.scopes.get(scopeId);
    // scope.localInjector = null;
    // scope.rootInjector = null;
    scope.cleanUps.forEach((fn) => fn());
    this.scopes.delete(scopeId);
  }

  private getScope(scopeId: symbol): Scope {
    if (!scopeId) {
      throw new Error('Scope is missing');
    }

    const scope = this.scopes.get(scopeId);

    return scope;
  }

  private register<T>(
    injectionDef: InjectionDef<T>,
    factory: any,
    scopeId?: symbol
  ) {
    const scopeMap = this.registrations.get(scopeId);

    if (!scopeMap) {
      this.registrations.set(
        scopeId,
        new Map([[injectionDef.token.token, { value: factory() }]])
      );

      console.log('DI: Registered', injectionDef.resolveFn.name);
    } else {
      if (scopeMap.has(injectionDef.token.token)) {
        throw new Error('This object is already registered');
      }

      scopeMap.set(injectionDef.token.token, {
        value: factory(),
      });

      console.log('DI: Registered', injectionDef.resolveFn.name);
    }

    // const _scope = this.scopes.get(scopeId);

    // _scope.onRelease(() => {
    //   this.unregister(injectionDef, scope);
    // });
  }

  private unregister<T>(injectionDef: InjectionDef<T>, scopeInfo?: ScopeInfo) {
    console.log('destroyed', injectionDef.resolveFn.name);
    this.registrations.get(scopeInfo.id).delete(injectionDef.token.token);

    if (this.registrations.get(scopeInfo.id).size === 0) {
      this.registrations.delete(scopeInfo.id);
    }
  }

  private createRootScope(): void {
    this.createNewScope(ROOT_SCOPE);
  }

  private createNewScope(scopeId?: symbol, options?: ScopeOptions): Scope {
    const id = scopeId || Symbol('SCOPE_ID');
    const parentId = options?.parentId;
    const cleanUps = [];
    const inject = <T>(token: InjectionToken<T>) => {
      if (token === containerToken) {
        return this;
      }
      return this.getDependency(token.token, id, parentId);
    };
    const onRelease = (callback: () => void) => cleanUps.push(callback);

    const scope = {
      id,
      parentId: options?.parentId,
      inject,
      onRelease,
    } as Scope;

    const managedScope = {
      ...scope,
      cleanUps,
    };

    this.scopes.set(id, managedScope);

    return scope;
  }
}

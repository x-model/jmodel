import { Lifetime } from './lifetime';

export interface Type<T> extends Function {
  new (...args: any[]): T;
}

export type Injector = {
  get<T>(
    token: ProviderToken<T>
    // notFoundValue: undefined,
  ): T;
};

export type ProviderToken<T> = Type<T>;

export type InjectionToken<T> = { token: symbol };

export type InjectionTokenType<T> = T extends InjectionToken<infer TInner>
  ? TInner
  : T;

export type InjectionDef<T> = {
  token: InjectionToken<T>;
  lifetime: Lifetime;
  resolveFn;
};

export type InjectionResult<T> = T extends InjectionToken<infer IType>
  ? IType
  : T extends InjectionDef<infer IDef>
  ? IDef
  : never;

export type ScopeOptions = {
  parentId: symbol;
  // rootInjector: Injector;
  // localInjector: Injector;
  onRelease: (callback: () => void) => void;
};

export type Scope = {
  id: symbol;
  parentId?: symbol;
  // rootInjector: Injector;
  // localInjector: Injector;
  onRelease: (callback: () => void) => void;
  inject: <T>(token: InjectionToken<T>) => T;
};

export type ManagedScope = Scope & { cleanUps: (() => void)[] };

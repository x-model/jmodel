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
  type;
  resolveFn;
};

export type InjectionResult<T> = T extends InjectionToken<infer IType>
  ? IType
  : T extends InjectionDef<infer IDef>
  ? IDef
  : never;

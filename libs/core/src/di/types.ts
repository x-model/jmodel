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

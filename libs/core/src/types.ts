export type Method<R> = (...args: any[]) => R;

export type Methods = Record<string, Method<unknown>>;

export type Factory<Input, Output> = (context: Input) => Output;

export type Unwrap<T> = NonNullable<{ [K in keyof T]: T[K] }>;

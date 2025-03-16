import { InjectionToken } from './types';

export enum Lifetime {
  singleton = 1,
  transient = 2,
  scoped = 3,
}

export function asSingleton<T>(token: InjectionToken<T>, resolveFn) {
  return {
    token,
    lifetime: Lifetime.singleton,
    resolveFn,
  };
}

export function asTransient<T>(token: InjectionToken<T>, resolveFn) {
  return {
    token,
    lifetime: Lifetime.transient,
    resolveFn,
  };
}

export function asScoped<T>(token: InjectionToken<T>, resolveFn) {
  return {
    token,
    lifetime: Lifetime.scoped,
    resolveFn,
  };
}

import { InjectionToken } from './types';

export enum Lifetime {
  singleton = 1,
  transient = 2,
  scoped = 3,
}

export function singleton<T>(token: InjectionToken<T>, resolveFn) {
  return {
    token,
    lifetime: Lifetime.singleton,
    resolveFn,
  };
}

export function perLifetimeScope<T>(token: InjectionToken<T>, resolveFn) {
  return {
    token,
    lifetime: Lifetime.scoped,
    resolveFn,
  };
}

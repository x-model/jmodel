import { InjectionToken } from './types';

export function singleton<T>(token: InjectionToken<T>, resolveFn) {
  return {
    token,
    type: 'singleInstance',
    resolveFn,
  };
}

export function perLifetimeScope<T>(token: InjectionToken<T>, resolveFn) {
  return {
    token,
    type: 'instancePerLifetimeScope',
    resolveFn,
  };
}

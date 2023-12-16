export function singleton(token: symbol, resolveFn) {
  return {
    token,
    type: 'singleInstance',
    resolveFn,
  };
}

export function perLifetimeScope(token: symbol, resolveFn) {
  return {
    token,
    type: 'instancePerLifetimeScope',
    resolveFn,
  };
}

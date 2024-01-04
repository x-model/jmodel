import { typeBuilder } from '../builders/type-builder';
import { INJECTABLE } from '../di/consts';
import { DiContainer } from '../di/container';
import { Scope } from '../fragment/types';

export function context(config: {
  providers?: any[];
  internal?: any;
  public?: any;
}): any {
  const factory = (scope: Scope) => {
    const container = scope.rootInjector.get(DiContainer);

    config.providers?.forEach((item) => {
      let provider: {
        token: any;
        type: any;
        resolveFn: any;
      };

      if (Array.isArray(item) && item.length === 2) {
        provider = {
          token: item[0].token,
          type: null,
          resolveFn: item[1],
        };
      } else {
        provider = { ...item, token: item.token.token };
      }

      const factory = () => {
        const resolved = provider.resolveFn();
        if (typeof resolved === 'function' && resolved[INJECTABLE]) {
          return resolved(scope);
        }
        return resolved;
      };

      container.resolve(provider as any, factory, {
        id: scope.id,
      });
    });

    const build = typeBuilder();
    const result = build(config.public);

    return new result(scope);
  };

  factory[INJECTABLE] = true;

  return factory;
}

import { typeBuilder } from '../builders/type-builder';
import { INJECTABLE } from '../di/consts';
import { DiContainer } from '../di/container';
import { ExecutionContext, Scope } from '../fragment/types';
import { INTERNAL, PUBLIC } from '../types';
import { BuilderPartialContext } from './types';

export function context<Result extends BuilderPartialContext>(
  config?: (context: ExecutionContext) => Result
): any {
  return {
    public: (publicConfig: <R>(context: Result) => any) => {
      const factory = (scope: Scope) => {
        const container = scope.rootInjector.get(DiContainer);

        const build = typeBuilder() as any;
        const result = build((context) => {
          const internalProps = config ? config(context) : context;

          const publicProps = publicConfig(internalProps);

          return { [INTERNAL]: internalProps, [PUBLIC]: publicProps };
        });

        return new result(scope);
      };

      factory[INJECTABLE] = true;

      return factory;
    },
  };
}

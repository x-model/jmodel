import { CreationContext, ExecutionContext } from '../fragment/types';
import { Builder, BuilderPartialContext } from '../builder/types';
import { Factory } from '../types';

export type ResolveFn<T extends Record<string, unknown>> = (
  config: CreationContext
) => T;

export type Repository<T extends Record<string, unknown>> = {
  name: string;
  resolve: ResolveFn<T>;
};

export type BuilderConfig = {
  name: string;
};

export function repositoryBuilder(
  builderConfig?: BuilderConfig
): Builder<ExecutionContext, Repository<any>> {
  return function <FactoryResult extends BuilderPartialContext>(
    factory: Factory<ExecutionContext, FactoryResult>
  ): Repository<any> {
    const resolveFn = function (config: CreationContext) {
      const _config = factory(config) as FactoryResult & CreationContext;

      const _innerContext = getInnerContext<FactoryResult & CreationContext>(
        _config,
        config
      );

      const result = {};

      for (const key in _innerContext) {
        Object.defineProperty(result, key, {
          value: _innerContext[key],
          writable: false,
        });
      }

      return result;
    };

    return {
      name: builderConfig.name,
      resolve: resolveFn,
    };
  };
}

function getInnerContext<
  Context extends BuilderPartialContext & CreationContext
>(
  context: Context,
  creationContext: CreationContext
): Exclude<Context, CreationContext> {
  const toExclude = Object.keys(creationContext);

  return Object.keys(context).reduce(
    (result, key) =>
      toExclude.includes(key) ? result : { ...result, [key]: context[key] },
    {}
  ) as Exclude<Context, CreationContext>;
}

import { ExecutionContext } from '../fragment/types';
import { Builder, BuilderPartialContext } from '../builder/types';

export type PartialModel<T> = (config: ExecutionContext) => T;

export type BuilderConfig = {
  name: string;
};

export function partialBuilder<Config extends BuilderPartialContext>(
  builderConfig?: BuilderConfig
): Builder<ExecutionContext, PartialModel<Config>> {
  return function (
    factory: (initialContext: ExecutionContext) => ExecutionContext & Config
  ): PartialModel<Config> {
    return function (config: ExecutionContext): Config {
      const _config = factory(config);

      const _innerContext = getInnerContext<Config & ExecutionContext>(
        _config,
        config
      );

      // const result = {};

      // for (const key in _innerContext) {
      //   Object.defineProperty(result, key, {
      //     value: _innerContext[key],
      //     writable: false,
      //   });
      // }

      // Why example below doesn't work when I used writable: false?
      //const copyResult = { ...result };
      //return result as Config;
      ///////////////////////////////////
      return _innerContext as Config;
    };
  };
}

function getInnerContext<
  Context extends BuilderPartialContext & ExecutionContext
>(
  context: Context,
  creationContext: ExecutionContext
): Exclude<Context, ExecutionContext> {
  const toExclude = Object.keys(creationContext);

  return Object.keys(context).reduce(
    (result, key) =>
      toExclude.includes(key) ? result : { ...result, [key]: context[key] },
    {}
  ) as Exclude<Context, ExecutionContext>;
}

import { Builder, BuilderPartialContext } from '../builder/types';
import { ExecutionContext } from '../fragment/types';

export function from<Config extends BuilderPartialContext>(
  initialContext: ExecutionContext
): Builder<ExecutionContext, Config> {
  return function (
    factory: (initialContext: ExecutionContext) => ExecutionContext & Config
  ): Config {
    return factory(initialContext);
  };
}

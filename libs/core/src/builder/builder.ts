import { Factory } from '../types';
import { Builder, BuilderInitialContext, BuilderPartialContext } from './types';

export function builder<InitialContext extends BuilderInitialContext>(
  builderConfig?: { context: InitialContext } & Record<string, unknown>
): Builder<InitialContext, InitialContext & BuilderPartialContext> {
  return function <
    FactoryResult extends InitialContext & BuilderPartialContext
  >(factory: Factory<InitialContext, FactoryResult>): FactoryResult {
    return factory(builderConfig?.context ?? ({} as InitialContext));
  };
}

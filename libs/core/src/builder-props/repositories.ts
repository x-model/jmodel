import { BuilderPartialContext } from '../builder/types';
import { RepositoryType } from '../builders/repository-builder';
import { CreationContext } from '../fragment/types';
import { Factory, Unwrap } from '../types';

export function repositories<
  RepositoryFactories extends Record<string, RepositoryType<any>>,
  Input extends BuilderPartialContext,
  Output extends {
    [P in keyof RepositoryFactories]: ReturnType<
      RepositoryFactories[P]['resolve']
    >;
  }
>(
  repositoryFactories: RepositoryFactories
): Factory<Input, Unwrap<Input & Output>> {
  return (context: Input & CreationContext) => {
    const repositoryInstances =
      repositoryFactories &&
      (Object.keys(repositoryFactories).reduce(
        (instances, repositoryKey) => ({
          ...instances,
          [repositoryKey]: repositoryFactories[repositoryKey].resolve(context),
        }),
        {}
      ) as Output);

    return {
      ...context,
      ...repositoryInstances,
    };
  };
}

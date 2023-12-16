import { BuilderPartialContext } from '../builder/types';
import { resolveFragment } from '../fragment/resolver';
import { CreationContext, FragmentFactory } from '../fragment/types';
import { Factory, Unwrap } from '../types';

export function fragments<
  FragmentFactories extends Record<string, FragmentFactory<unknown, unknown>>,
  Input extends BuilderPartialContext,
  Output extends {
    [P in keyof FragmentFactories]: ReturnType<FragmentFactories[P]>;
  }
>(
  fragmentFactories: FragmentFactories
): Factory<Input, Unwrap<Input & Output>> {
  return (context: Input & CreationContext) => {
    const fragmentInstances =
      fragmentFactories &&
      (Object.keys(fragmentFactories).reduce(
        (instances, fragmentKey) => ({
          ...instances,
          [fragmentKey]: resolveFragment(
            fragmentFactories[fragmentKey],
            context._templateRegistry,
            { contextId: context._contextId, injector: context._injector }
          ),
        }),
        {}
      ) as Output);

    return {
      ...context,
      ...fragmentInstances,
    };
  };
}

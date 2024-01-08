import { BuilderPartialContext } from '../builder/types';
import { resolveFragment } from '../fragment/resolver';
import {
  CreationContext,
  Fragment,
  FragmentFactory,
  FragmentResultType,
} from '../fragment/types';
import { Factory, Unwrap } from '../types';

type FragmentInputType<T> = T extends Fragment<infer TIn, unknown>
  ? TIn
  : never;

export function fragments<
  FragmentFactories extends Record<string, FragmentFactory<unknown, unknown>>,
  Input extends BuilderPartialContext,
  Output extends {
    [P in keyof FragmentFactories]: (
      input?: FragmentInputType<ReturnType<FragmentFactories[P]>>
    ) => FragmentResultType<ReturnType<FragmentFactories[P]>>;
  }
>(
  fragmentFactories: FragmentFactories
): Factory<Input, Unwrap<Input & Output>> {
  return (context: Input & CreationContext) => {
    const fragmentInstances =
      fragmentFactories &&
      (Object.keys(fragmentFactories).reduce((instances, fragmentKey) => {
        const fragment = resolveFragment(fragmentFactories[fragmentKey], {
          contextId: context._contextId,
          injector: context._injector,
        });

        return {
          ...instances,
          // [fragmentKey.replace(/\$$/g, '')]: <TFragmentIn, TFragmentOut>(
          [fragmentKey]: <TFragmentIn, TFragmentOut>(input: TFragmentIn) =>
            context._exec<TFragmentIn, TFragmentOut>(fragment as any, input),
        };
      }, {}) as Output);

    return {
      ...context,
      ...fragmentInstances,
    };
  };
}

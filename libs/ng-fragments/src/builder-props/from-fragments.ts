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

export function fromFragments<
  FragmentFactories extends Record<
    string,
    (
      resolve: <TFragmentIn, TFragmentOut>(
        fragmentFactory: FragmentFactory<TFragmentIn, TFragmentOut>,
        input?: TFragmentIn
      ) => Fragment<TFragmentIn, TFragmentOut>
    ) => Fragment<unknown, unknown>
  >,
  Input extends BuilderPartialContext,
  Output extends {
    [P in keyof FragmentFactories]: FragmentResultType<
      ReturnType<FragmentFactories[P]>
    >;
  }
>(
  fragmentFactories: FragmentFactories
): Factory<Input, Unwrap<Input & Output>> {
  return (context: Input & CreationContext) => {
    const fragmentInstances =
      fragmentFactories &&
      (Object.keys(fragmentFactories).reduce((instances, fragmentKey) => {
        const resolver = fragmentFactories[fragmentKey];

        const fragment = resolver((fragmentFactory, input) => {
          const fragment = resolveFragment(
            fragmentFactory,
            context._templateRegistry,
            { contextId: context._contextId, injector: context._injector }
          );

          return context._exec(fragment as any, input);
        });

        return {
          ...instances,
          // [fragmentKey.replace(/\$$/g, '')]: <TFragmentIn, TFragmentOut>(
          [fragmentKey]: fragment,
        };
      }, {}) as Output);

    return {
      ...context,
      ...fragmentInstances,
    };
  };
}

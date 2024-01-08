import {
  FragmentCreationContext,
  FragmentFactory,
  FragmentFn,
  FragmentFunctionContext,
  FragmentOptions,
} from '../fragment/types';

export function memoFragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return (creationContext: FragmentCreationContext) => {
    const state = { result: undefined };

    return {
      execute: (
        context: FragmentFunctionContext<TFragmentIn>
      ): TFragmentOut => {
        if (state.result) {
          return state.result;
        }

        state.result = fragmentFn({ ...context });

        return state.result;
      },
      creationContext,
    };
  };
}

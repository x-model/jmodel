import {
  Fragment,
  FragmentFn,
  FragmentFunctionContext,
} from '../fragment/types';

export function memoFragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>
): Fragment<TFragmentIn, TFragmentOut> {
  const state = { result: undefined };

  return (context: FragmentFunctionContext<TFragmentIn>): TFragmentOut => {
    if (state.result) {
      return state.result;
    }

    state.result = fragmentFn({ ...context });

    return state.result;
  };
}

import {
  FragmentCreationContext,
  FragmentFactory,
  FragmentFn,
  FragmentFunctionContext,
  FragmentOptions,
} from '../fragment/types';

export function fragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return (creationContext: FragmentCreationContext) => {
    return {
      execute: (context: FragmentFunctionContext<TFragmentIn>): TFragmentOut =>
        fragmentFn({ ...context }),
      creationContext,
    };
  };
}

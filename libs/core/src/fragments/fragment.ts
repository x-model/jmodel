import {
  Fragment,
  FragmentFn,
  FragmentFunctionContext,
} from '../fragment/types';

export function fragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>
): Fragment<TFragmentIn, TFragmentOut> {
  return (context: FragmentFunctionContext<TFragmentIn>): TFragmentOut =>
    fragmentFn({ ...context });
}

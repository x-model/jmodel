import { fragmentFactory } from '../fragment/factory';
import {
  FragmentFactory,
  FragmentFn,
  FragmentOptions,
} from '../fragment/types';
import { memoFragmentTemplate } from './memo-fragment';

export function storeFragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return fragmentFactory(
    memoFragmentTemplate<TFragmentIn, TFragmentOut>(),
    fragmentFn,
    options
  );
}

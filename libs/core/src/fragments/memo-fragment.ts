import { build } from '../builder/build';
import {
  fragmentTemplateBuilder,
  onExecute,
} from '../builders/fragment-template-builder';
import { props } from '../builder-props/props';
import {
  FragmentFactory,
  FragmentFn,
  FragmentOptions,
  FragmentTemplate,
} from '../fragment/types';
import { fragmentFactory } from '../fragment/factory';

export function memoFragmentTemplate<
  TFragmentIn,
  TFragmentOut
>(): FragmentTemplate<TFragmentIn, TFragmentOut> {
  const STATE = Symbol('STATE');

  return build(
    fragmentTemplateBuilder<TFragmentIn, TFragmentOut>({
      name: 'memo',
    }),
    props(() => ({
      [STATE]: { result: undefined },
    })),
    onExecute(({ [STATE]: state }) => ({ executionContext, fragmentFn }) => {
      if (state.result) {
        return state.result;
      }

      state.result = fragmentFn({ ...executionContext });

      return state.result;
    })
  );
}

export function memoFragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return fragmentFactory(
    memoFragmentTemplate<TFragmentIn, TFragmentOut>(),
    fragmentFn,
    options
  );
}

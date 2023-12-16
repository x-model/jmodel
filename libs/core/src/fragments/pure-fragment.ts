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

export function pureFragmentTemplate<
  TFragmentIn,
  TFragmentOut
>(): FragmentTemplate<TFragmentIn, TFragmentOut> {
  const STATE = Symbol('STATE');

  return build(
    fragmentTemplateBuilder<TFragmentIn, TFragmentOut>({
      name: 'pure',
    }),
    props(() => ({
      [STATE]: { result: undefined, prevInput: undefined },
    })),
    onExecute(({ [STATE]: state }) => ({ executionContext, fragmentFn }) => {
      if (state.prevInput === executionContext._input && state.result) {
        return state.result;
      }

      state.prevInput = executionContext._input;
      state.result = fragmentFn({ ...executionContext });

      return state.result;
    })
  );
}

export function pureFragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return fragmentFactory(
    pureFragmentTemplate<TFragmentIn, TFragmentOut>(),
    fragmentFn,
    options
  );
}

import { fragmentFactory } from '../fragment/factory';
import { build } from '../builder/build';
import { fragmentTemplateBuilder } from '../builders/fragment-template-builder';
import {
  FragmentFactory,
  FragmentFn,
  FragmentOptions,
  FragmentTemplate,
} from '../fragment/types';

const templateId = Symbol('fragment');

export function fragmentTemplate<TFragmentIn, TFragmentOut>(): FragmentTemplate<
  TFragmentIn,
  TFragmentOut
> {
  return build(
    fragmentTemplateBuilder<TFragmentIn, TFragmentOut>({
      static: 'root',
      templateId,
      name: 'fragment',
    })
  );
}

export function fragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return fragmentFactory(
    fragmentTemplate<TFragmentIn, TFragmentOut>(),
    fragmentFn,
    options
  );
}

import {
  FragmentTemplate,
  FragmentCreationContext,
  FragmentFn,
  FragmentFactory,
  FragmentOptions,
} from './types';

export function fragmentFactory<TFragmentIn, TFragmentOut>(
  template: FragmentTemplate<TFragmentIn, TFragmentOut>,
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return (creationContext: FragmentCreationContext) => {
    const resolvedTemplate = template.resolve({ creationContext });

    return resolvedTemplate(fragmentFn, creationContext);
  };
}

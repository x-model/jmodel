import {
  FragmentTemplate,
  FragmentCreationContext,
  FragmentFn,
  FragmentFactory,
  FragmentOptions,
} from './types';
import { TemplateResolver } from './template-registry';

export function fragmentFactory<TFragmentIn, TFragmentOut>(
  template: FragmentTemplate<TFragmentIn, TFragmentOut>,
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return (
    creationContext: FragmentCreationContext,
    templateResolver: TemplateResolver
  ) => {
    const resolvedTemplate = templateResolver.resolve(
      template,
      creationContext,
      options
    );

    return resolvedTemplate(fragmentFn, creationContext);
  };
}

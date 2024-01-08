import {
  FragmentTemplate,
  FragmentCreationContext,
  FragmentFn,
  FragmentFactory,
  FragmentOptions,
  TemplateCreationContext,
  TemplateResolveResult,
} from './types';

function resolveTemplate<TFragmentIn, TFragmentOut>(
  template: FragmentTemplate<TFragmentIn, TFragmentOut>,
  creationContext: TemplateCreationContext,
  options?: FragmentOptions
): TemplateResolveResult<TFragmentIn, TFragmentOut> {
  const resolvedTemplate = template.resolve({ creationContext });

  return resolvedTemplate;
}

export function fragmentFactory<TFragmentIn, TFragmentOut>(
  template: FragmentTemplate<TFragmentIn, TFragmentOut>,
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return (creationContext: FragmentCreationContext) => {
    const resolvedTemplate = resolveTemplate(
      template,
      creationContext,
      options
    );

    return resolvedTemplate(fragmentFn, creationContext);
  };
}

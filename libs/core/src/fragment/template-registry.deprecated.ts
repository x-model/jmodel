import {
  FragmentOptions,
  FragmentTemplate,
  TemplateCreationContext,
  TemplateResolveResult,
} from './types';

export type TemplateResolver = {
  resolve: <TFragmentIn, TFragmentOut>(
    template: FragmentTemplate<TFragmentIn, TFragmentOut>,
    creationContext: TemplateCreationContext,
    options?: FragmentOptions
  ) => TemplateResolveResult<TFragmentIn, TFragmentOut>;
};

export class TemplateRegistry implements TemplateResolver {
  staticTemplates: {
    id: symbol;
    fragmentFactory: TemplateResolveResult<unknown, unknown>;
  }[] = [];

  resolve<TFragmentIn, TFragmentOut>(
    template: FragmentTemplate<TFragmentIn, TFragmentOut>,
    creationContext: TemplateCreationContext,
    options?: FragmentOptions
  ): TemplateResolveResult<TFragmentIn, TFragmentOut> {
    const existingTemplate = this.staticTemplates.find(
      (item) => item.id === template.id
    );

    if (existingTemplate) {
      return existingTemplate.fragmentFactory as TemplateResolveResult<
        TFragmentIn,
        TFragmentOut
      >;
    }

    const resolvedTemplate = template.resolve({ creationContext });

    // TODO handle root, context separately
    if (['root', 'context'].includes(template.static)) {
      this.staticTemplates.push({
        id: template.id,
        fragmentFactory: resolvedTemplate,
      });
    }

    return resolvedTemplate;
  }
}

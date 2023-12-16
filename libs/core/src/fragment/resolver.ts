import { TemplateResolver } from './template-registry';
import { Fragment, FragmentCreationContext, FragmentFactory } from './types';

export function resolveFragment<TFragmentIn, TFragmentOut>(
  fragmentOrFactory:
    | FragmentFactory<TFragmentIn, TFragmentOut>
    | Fragment<TFragmentIn, TFragmentOut>,
  templateRegistry: TemplateResolver,
  creationContext: FragmentCreationContext
): Fragment<TFragmentIn, TFragmentOut> {
  return typeof fragmentOrFactory === 'function'
    ? (fragmentOrFactory as FragmentFactory<TFragmentIn, TFragmentOut>)(
        creationContext,
        templateRegistry
      )
    : (fragmentOrFactory as Fragment<TFragmentIn, TFragmentOut>);
}

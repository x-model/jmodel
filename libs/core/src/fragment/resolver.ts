import { TemplateResolver } from './template-registry.deprecated';
import { Fragment, FragmentCreationContext, FragmentFactory } from './types';

export function resolveFragmentOld<TFragmentIn, TFragmentOut>(
  fragmentOrFactory:
    | FragmentFactory<TFragmentIn, TFragmentOut>
    | Fragment<TFragmentIn, TFragmentOut>,
  templateRegistry: TemplateResolver,
  creationContext: FragmentCreationContext
): Fragment<TFragmentIn, TFragmentOut> {
  throw new Error('Deprecated');
  // return typeof fragmentOrFactory === 'function'
  //   ? (fragmentOrFactory as FragmentFactory<TFragmentIn, TFragmentOut>)(
  //       creationContext,
  //       templateRegistry
  //     )
  //   : (fragmentOrFactory as Fragment<TFragmentIn, TFragmentOut>);
}

export function resolveFragment<TFragmentIn, TFragmentOut>(
  fragmentOrFactory:
    | FragmentFactory<TFragmentIn, TFragmentOut>
    | Fragment<TFragmentIn, TFragmentOut>,
  creationContext: FragmentCreationContext
): Fragment<TFragmentIn, TFragmentOut> {
  return typeof fragmentOrFactory === 'function'
    ? (fragmentOrFactory as FragmentFactory<TFragmentIn, TFragmentOut>)(
        creationContext
      )
    : (fragmentOrFactory as Fragment<TFragmentIn, TFragmentOut>);
}

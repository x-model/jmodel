import { INJECTABLE, injectionToken } from '../di/consts';
import { Scope } from '../di/types';
import { TemplateResolver } from './template-registry.deprecated';
import {
  CreationContext,
  Fragment,
  FragmentCreationContext,
  FragmentFactory,
} from './types';

export const contextToken = injectionToken('context');

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

export function fragmentFactory(fragment: Fragment<any, any>) {
  const factory = (scope: Scope, creationContext: CreationContext) => {
    // const container = scope.rootInjector.get(Container);
    const context: any = creationContext._inject(contextToken as any);

    const result = (input?: any) => fragment({ ...context, _input: input });
    return result;
  };

  factory[INJECTABLE] = true;

  return factory;
}

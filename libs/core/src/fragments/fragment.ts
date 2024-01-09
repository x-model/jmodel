import { injectionToken } from '../di/consts';
import { asTransient } from '../di/lifetime';
import { InjectionDef } from '../di/types';
import { fragmentFactory } from '../fragment/resolver';
import { FragmentFn, FragmentFunctionContext } from '../fragment/types';

export function fragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>
): InjectionDef<(input?: TFragmentIn) => TFragmentOut> {
  return asTransient(
    injectionToken<(input?: TFragmentIn) => TFragmentOut>('fragment'),
    () =>
      fragmentFactory(
        (context: FragmentFunctionContext<TFragmentIn>): TFragmentOut =>
          fragmentFn({ ...context })
      )
  );
}

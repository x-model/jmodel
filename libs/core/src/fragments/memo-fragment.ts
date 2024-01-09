import { injectionToken } from '../di/consts';
import { asTransient } from '../di/lifetime';
import { InjectionDef } from '../di/types';
import { fragmentFactory } from '../fragment/resolver';
import { FragmentFn, FragmentFunctionContext } from '../fragment/types';

export function memoFragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>
): InjectionDef<(input?: TFragmentIn) => TFragmentOut> {
  return asTransient(
    injectionToken<(input?: TFragmentIn) => TFragmentOut>('fragment'),
    () =>
      fragmentFactory(
        (() => {
          const state = { result: undefined };

          return (
            context: FragmentFunctionContext<TFragmentIn>
          ): TFragmentOut => {
            if (state.result) {
              return state.result;
            }

            state.result = fragmentFn({ ...context });

            return state.result;
          };
        })()
      )
  );
}

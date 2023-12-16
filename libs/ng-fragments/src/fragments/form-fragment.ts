import { DestroyRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  build,
  fragmentTemplateBuilder,
  onExecute,
  FragmentFactory,
  FragmentFunctionContext,
  FragmentOptions,
  FragmentTemplate,
  props,
  fragmentFactory,
  methods,
} from '@web-fragments/core';

type Subscription = {
  unsubscribe: () => void;
};

type Observable<T> = {
  subscribe: (next: (value: T) => void) => Subscription;
};

export interface FormContext<Tin> extends FragmentFunctionContext<Tin> {
  _formBuilder: FormBuilder;
  _observe: <T>(observable: Observable<T>, next: (value: T) => void) => void;
}

export function formFragmentTemplate<
  TFragmentIn,
  TFragmentOut
>(): FragmentTemplate<TFragmentIn, TFragmentOut> {
  const STATE = Symbol('STATE');

  return build(
    fragmentTemplateBuilder<TFragmentIn, TFragmentOut>({
      name: 'form',
    }),
    props(({ _inject }) => ({
      _formBuilder: _inject(FormBuilder),
      [STATE]: { result: undefined, subs: [] },
    })),
    methods(({ [STATE]: state }) => ({
      _observe: <T>(observable: Observable<T>, action: (value: T) => void) => {
        state.subs.push(observable.subscribe(action));
      },
    })),
    onExecute((context) => ({ executionContext, fragmentFn }) => {
      const { [STATE]: state, _inject } = context;

      if (state.result) {
        return state.result;
      }

      state.result = fragmentFn({ ...executionContext, ...context });

      // _inject(DestroyRef).onDestroy(() => {
      //   state.subs.forEach((item) => item.unsubscribe());
      // });

      return state.result;
    })
  );
}

export function formFragment<TFragmentIn, TFragmentOut>(
  fragmentFn: (context: FormContext<TFragmentIn>) => TFragmentOut,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return fragmentFactory(
    formFragmentTemplate<TFragmentIn, TFragmentOut>(),
    fragmentFn,
    options
  );
}

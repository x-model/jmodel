import { Signal, signal } from '@angular/core';

export function refToSignal<T, Value>(
  ref: { $: (value: any) => any; $value: any }
  // onCleanUp?: Ref<T>
): Signal<Value> {
  const _signal = signal(ref.$value);
  ref.$((value) => {
    console.log('value changed', value);
    _signal.set(value);
  });

  return _signal;
}

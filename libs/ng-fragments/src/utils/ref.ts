import { Signal, signal } from '@angular/core';
import { Query, ReactiveModel, Ref } from '@web-fragments/core';

// watch(source, callback,
//   { immediate: true } | { deep: true }
// )

// // single ref
// watch(x, (newX) => {
//   console.log(`x is ${newX}`)
// })

// // getter
// watch(
//   () => x.value + y.value,
//   (sum) => {
//     console.log(`sum of x + y is: ${sum}`)
//   }
// )

// // array of multiple sources
// watch([x, () => y.value], ([newX, newY]) => {
//   console.log(`x is ${newX} and y is ${newY}`)
// })

export function refToSignal<T, Value>(
  model: ReactiveModel<T>,
  query: Query<T, Value>,
  onCleanUp: Ref<T>
): Signal<Value> {
  const value = model.get(query) as Value;
  const _signal = signal(value);

  model.watch(query, () => (value) => {
    console.log('value changed', value);
    _signal.set(value);
  });

  // emituje wartość po dwa razy np. dla player1 i tak samo dla player2, pewnie przez isLoading
  // emituje wartość po dwa razy dla isLoading, no ale to dlatego,
  // że jest osobny watcher dla player1.isLoading i player2.isLoading

  // onCleanUp?.watch(() => ref.unwatch(watcher));

  return _signal;
}

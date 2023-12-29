import { Signal, signal } from '@angular/core';
import { Ref, Watcher, SchemaMember } from '@web-fragments/core';

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

export function refToSignal<T>(
  state,
  selectorOrWatcher:
    | SchemaMember<unknown>
    | Watcher<unknown[], (args: unknown[]) => unknown>,
  onCleanUp: Ref<T>
): Signal<T> {
  const value = getValue(state, selectorOrWatcher);
  const _signal = signal(value);

  state.watch(selectorOrWatcher, () => (value) => {
    console.log('value changed', selectorOrWatcher, value);
    _signal.set(value);
  });

  // emituje wartość po dwa razy np. dla player1 i tak samo dla player2, pewnie przez isLoading
  // emituje wartość po dwa razy dla isLoading, no ale to dlatego,
  // że jest osobny watcher dla player1.isLoading i player2.isLoading

  // onCleanUp?.watch(() => ref.unwatch(watcher));

  return _signal;
}

function getValue(
  state,
  selectorOrWatcher:
    | SchemaMember<unknown>
    | Watcher<unknown[], (args: unknown[]) => unknown>
) {
  let values = [];
  let value;
  const isWatcher = selectorOrWatcher['resolver'] != null;
  let selectors = isWatcher
    ? (selectorOrWatcher as Watcher<unknown[], (args: unknown[]) => unknown>)
        .paths
    : [selectorOrWatcher as SchemaMember<unknown>];

  for (let index = 0; index < selectors.length; index++) {
    const value = state.get(selectors[index]);
    values.push(value);
  }

  value = isWatcher
    ? (
        selectorOrWatcher as Watcher<unknown[], (args: unknown[]) => unknown>
      ).resolver(values)
    : values[0];

  return value;
}

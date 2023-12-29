import { Signal, signal } from '@angular/core';
import { Ref } from '@web-fragments/core';

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
  selectors: any[],
  onCleanUp: Ref<T>
): Signal<T> {
  const value = getValue(state, selectors);
  const _signal = signal(value);

  if (selectors.length > 1) {
    for (let index = 0; index < selectors.length - 1; index++) {
      state.watch(selectors[index], () => (value) => {
        console.log('value changed', value);
        const _value = getValue(state, selectors);
        _signal.set(_value);
      });
    }
  } else {
    state.watch(selectors[0], () => (value) => {
      console.log('value changed', value);
      const _value = getValue(state, selectors);
      _signal.set(value);
    });
  }

  // emituje wartość po dwa razy np. dla player1 i tak samo dla player2, pewnie przez isLoading
  // emituje wartość po dwa razy dla isLoading, no ale to dlatego,
  // że jest osobny watcher dla player1.isLoading i player2.isLoading

  // onCleanUp?.watch(() => ref.unwatch(watcher));

  return _signal;
}

function getValue(state, selectors: any[]) {
  let values = [];
  let value;

  if (selectors.length > 1) {
    for (let index = 0; index < selectors.length - 1; index++) {
      const value = state.get(selectors[index]);
      values.push(value);
    }

    value = selectors[selectors.length - 1](values);
  } else {
    value = state.get(selectors[0]);
  }

  return value;
}

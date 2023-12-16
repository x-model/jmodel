import { signal, Signal, computed } from '@angular/core';
import {
  Builder,
  BuilderPartialContext,
  Factory,
  Method,
  Unwrap,
  props,
  builder,
} from '@web-fragments/core';

export type SignalState<State extends Record<string, unknown>> = {
  state: Signal<State>;
  select: <T>(fn: (state: State) => T) => Signal<T>;
  update: (fn: (state: State) => State) => void;
};

export function signalState<State extends Record<string, unknown>>(
  initialState: State
): SignalState<State> {
  const stateSignal = signal(initialState as State);

  return {
    state: stateSignal.asReadonly(),
    select: <T>(fn: (state: State) => T) => computed(() => fn(stateSignal())),
    update: (fn: (state: State) => State) => stateSignal.set(fn(stateSignal())),
  };
}

export function storeBuilder<T extends Record<string, unknown>>(
  initialState?: T
): Builder<T, Record<string, unknown>> {
  return builder({ context: initialState });
}

export function getters<
  Input extends BuilderPartialContext,
  Output extends Record<string, Signal<unknown>>
>(factory: Factory<Input, Output>): Factory<Input, Unwrap<Input & Output>> {
  return props(factory);
}

export function updaters<
  Input extends BuilderPartialContext,
  Output extends Record<string, Method<void>>
>(factory: Factory<Input, Output>): Factory<Input, Unwrap<Input & Output>> {
  return props(factory);
}

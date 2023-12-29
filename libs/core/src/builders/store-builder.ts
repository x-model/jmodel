import {
  Builder,
  BuilderPartialContext,
  Factory,
  Method,
  Unwrap,
  props,
  builder,
} from '@web-fragments/core';

export type State<TState extends Record<string, unknown>> = {
  state: TState;
  select<R>(selector: (state: TState) => R): Ref<R>;
  update(updater: (state: TState) => TState): void;
  destroy(): void;
};

export class RxValue<T> {
  private _watchers: symbol[] = [];
  private _value: T;
  onStateChange = new Map<symbol, (value: unknown) => void>([]);

  constructor(private readonly _path: string) {}

  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.onStateChange.forEach((fn) => fn(this._value));
  }

  watch(fn: (value: T) => void): symbol {
    const watcher = Symbol('WATCHER');
    this._watchers.push(watcher);
    this.onStateChange.set(watcher, (state: T) => fn(this._value));
    return watcher;
  }

  unwatch(watcher: symbol) {
    this.onStateChange.delete(watcher);
  }

  destroy() {
    this.onStateChange.clear();
    this._watchers = [];
  }
}

export type Ref<T> = {
  get: () => T;
  watch: (fn: (value: T) => void) => symbol;
  unwatch: (watcher: symbol) => void;
  destroy: () => void;

  // value?: string | boolean | number | undefined;
  // get?: (host, lastValue) => { ... };
  // set?: (host, value, lastValue) => { ... };
  // connect?: (host, key, invalidate) => { ... };
  // observe?: (host, value, lastValue) => { ... };
};

export function sv(obj: Object, propName: string) {
  let _value;
  Object.defineProperty(obj, propName, {
    get() {
      console.log('getData');
      return _value;
    },
    set(value) {
      console.log(value === '' ? 'Value is required' : 'valid');
      obj['errors'][propName] = value === '' ? 'Value is required' : 'valid';
      console.log(obj['errors']);
      _value = value;
    },
  });
}

// const Model = {
//   firstName: store.value(""),
//   count: store.value(0, (val) => val > 10, "Value must be bigger than 10"),
//   termsAndConditions: store.value(false),
//   ...,
// };

// const User = {
//   id: true,
//   name: store.value("", /^[a-z]+$/),
// };

//   user: store(User, { draft: true }),

//   store.error(user, "name")

//   formModel = {
//     value,
//     errors
//   }

//   class static Validator {
//     static required = validator((value, state) => !!value, 'Value is required') // zwraca boolean? albo error + details?
//     ruleFor
//   }

// dodawanie validatora do grupy czyli całego obiektu, albo dziecka obiektu

// asyncValidator => ustawia status pending? albo zwraca Promise
// co z testami? np. dla async validatora? w sumie możemy nadpisac fetcha

// a jak chcemy przetestować widok to możemy zdefiniować model bez validatorów

class StateManager<T> {
  private _state;
  constructor(private readonly initialState: T) {
    this._state = this.initialState;
  }
  onStateChange = new Map<symbol, (value: unknown) => void>([]);

  get state(): T {
    return this._state;
  }

  select<R>(selector: (state: T) => R): Ref<R> {
    const watchers: symbol[] = [];

    return {
      get: () => selector(this._state),
      watch: (fn: (value: R) => void) => {
        const watcher = Symbol('WATCHER');
        watchers.push(watcher);
        this.onStateChange.set(watcher, (state: T) => fn(selector(state)));
        return watcher;
      },
      unwatch: (watcher: symbol) => this.onStateChange.delete(watcher),
      destroy: () => {
        watchers.forEach((watcher) => this.onStateChange.delete(watcher));
      },
    };

    const { isLoading, player1 } = this._state;
    isLoading.value = false;
    player1.value;
  }

  update(updater: (state: T) => T): void {
    this._state = updater(this._state);
    this.onStateChange.forEach((fn) => fn(this._state));
  }

  destroy(): void {
    this.onStateChange.clear();
    this._state = null;
  }
}

export function createState<TState extends Record<string, unknown>>(
  initialState: TState
): State<TState> {
  return new StateManager(initialState);

  // // Start observing the target node for configured mutations
  // sm.observe((state) => state.isLoading);
  // sm.update(
  //   (state) => state.isLoading,
  //   (isLoading, state) => true
  // );

  // observer.commit();

  // // Later, you can stop observing
  // observer.disconnect();

  // return {
  //   state: stateSignal.asReadonly(),
  //   select: <T>(fn: (state: TState) => T) => computed(() => fn(stateSignal())),
  //   update: (fn: (state: TState) => TState) =>
  //     stateSignal.set(fn(stateSignal())),
  // };
}

export function storeBuilder<T extends Record<string, unknown>>(
  initialState?: T
): Builder<T, Record<string, unknown>> {
  return builder({ context: initialState });
}

export function getters<
  Input extends BuilderPartialContext,
  Output extends Record<string, State<any>>
>(factory: Factory<Input, Output>): Factory<Input, Unwrap<Input & Output>> {
  return props(factory);
}

export function updaters<
  Input extends BuilderPartialContext,
  Output extends Record<string, Method<void>>
>(factory: Factory<Input, Output>): Factory<Input, Unwrap<Input & Output>> {
  return props(factory);
}

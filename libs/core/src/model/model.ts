import { validator } from '../validator/validator';

// property
export function p<T>(param: T, validator?: any): T {
  return param;
}

// object
export function o<T>(param: T, validator?: any): T {
  return param;
}

// array
export function a<T>(param: T, validator?: any): T {
  return param;
}

// const c = () => {}; // collection
// const e = () => {}; // enumerable
// const i = () => {}; // iterable

const obj = o({
  field: '',
  child: o({
    field_1_1: '',
    child_1_1: o({
      field_2_1: 10,
      child_2_1: o({
        field_3_1: 10,
      }),
    }),
    field_1_2: '',
    child_1_2: o({
      field_2_1: 10,
      child_2_1: o({
        field_3_1: 10,
      }),
    }),
  }),
});

// form model
const obj20 = o({
  field: p(''),
  child: o({
    field_1_1: p('', validator),
    field_1_2: p(''),
    child_1: o({
      field_2_1: p(10),
    }),
  }),
});

export type Reactive<T> = {
  value: T;
};

export function set<T extends object>(
  obj: Reactive<T>,
  updater: (value: T) => T
) {}

export function createState<T>(obj: T): { saveChanges: () => void } {
  return {
    saveChanges: () => {},
  };
}

// obj
//   .updater(
//     set(state, (value) => ({ ...value, field: 'd' })),
//     // proxy na set i sprawdzać co się updatuje,
//     // czy to pokrywa wszystkie przypadki?
//     // jak np. updatować array?
//     set(state.child, (value) => ({ ...value, field_1_1: 'd_1_1' })),
//     set(state.child.child_1_1, (value) => ({ ...value, field_2_1: 'd_2_1' }))
//   )
//   .saveChanges();

// updater możnaby gdzieś wcześniej zdefiniować

const obj4 = {
  value: {
    name: {
      value: 'test',
      path: '', // do walidacji. Czy wgl potrzebne? czy walidacji nie da się ogarnąć w inny sposób?
      watchers: [],
    },
    child: {
      value: {
        id: {
          value: 10,
          watchers: [],
        },
      },
      watchers: [], // dodawać te tablice dynamicznie, jak ktoś zrobi watch,
      // żeby nie tworzyć niepotrzebnie obiektów, nawet całe pole watchers możnaby dodawać dynamicznie
    },
  },
  watchers: [],
};

export function createModel(model: any): any {
  let source = {
    value: {},
    watchers: [],
  };
  let facade = {};
  if (
    model &&
    // TODO handle null - null is also object
    typeof model === 'object' &&
    ['Array', 'Object'].includes(model.contructor.name)
  ) {
    const keys = Object.keys(model);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      Object.defineProperty(source.value, key, {
        value: {
          value: model[key],
          watchers: [],
        },
      });

      Object.defineProperty(facade, key, {
        get() {
          return source.value[key].value;
        },
        set(value) {
          source.value[key].value = value;

          source.watchers.forEach((watcher) => watcher());
          source.value[key].watchers.forEach((watcher) => watcher());
        },
      });
    }
  }

  const result = Object.setPrototypeOf(facade, {
    watch: () => {
      console.log('watching');
      source.watchers.push(console.log('watching'));
    },
  });

  return result;
}

const obj1 = {
  get name() {
    return obj4.value.name.value;
  },
  set name(val) {
    obj4.value.name.value = val;
    // wywołuje watchera na parencie i sobie samym
    obj4.watchers.forEach((watcher) => watcher());
    obj4.value.name.watchers.forEach((watcher) => watcher());
  },
  get child() {
    return obj2_1;
  },
  set child(val) {
    obj4.value.child.value = val;
    obj4.watchers.forEach((watcher) => watcher());
  },
};

// zabezpieczyć jakoś obiekty, żeby nie dało się podmienić obiektów
// i np. żeby potem nie wywoływały się niepoprawnie watchery
// i potem jeszcze żeby nie było problemu z pathami
// mamy powiedzmy takie data source + facade

// co gdyby ustawiać watchers tylko na 1 poziom?
// w sumie jak np. mamy jakiś isLoading to to raczej będzie tylko na 1 poziomie,
// jak mamy jakiś obiekt to będziemy zapewne chcieli go updatować w całości

const obj1_1 = Object.setPrototypeOf(obj1, {
  watch: () => {
    console.log('watching');
    obj4.watchers.push(console.log('watching'));
  },
});

const obj2 = {
  get id() {
    return obj4.value.child.value.id;
  },
  set id(val) {
    obj4.value.child.value.id = val;
    obj4.watchers.forEach((watcher) => watcher());
    obj4.value.child.watchers.forEach((watcher) => watcher());
    obj4.value.child.value.id.watchers.forEach((watcher) => watcher());
  },
};

const obj2_1 = Object.setPrototypeOf(obj2, {
  watch: () => {
    console.log('watching');
    obj4.value.child.watchers.push(console.log('watching'));
  },
});

obj2_1.watch();

// saveChanges będzie pilnowało tego żeby watchers wykonać tylko raz a nie 10 razy
// musimy mieć jakąś metodkę trigger i ona się wyzwoli dopiero na saveChanges
// a np. na set wrzucamy watcherów do jakiejś tablicy i będziemy sprawdzali czy już są dodani
// i potem saveChanges odpali tą tablicę i będzie robiło pop
// czy nie powinniśmy wyzwalać watcherów dla każdego parenta?
// może na watch dodać jakiś settings żeby śledził tylko wybrane rzeczy, żeby nie schodził mocno w dół
// i w jakiej kolejności odpalać? od szczegółu do ogółu, czy na odwrót?

// const myState = createState(obj);
// const { updaterFor, set, proxy, state } = myState;

// state.value.child.set((value) => ({ ...value, field: 'd' }));
// state
//   .get('child')
//   .get('child_1_1')
//   .set((value) => ({ ...value, field: 'd' }));

// updaterFor((state) => state.child.set((value) => ({ ...value, field: 'd' })));
// updaterFor(state).set((value) => ({ ...value, field: 'd' }));
// updaterFor(state.child).set((value) => ({ ...value, field: 'd' }));
// updaterFor(state.child.child_1_1).set((value) => ({
//   ...value,
//   field: 'd',
// }));

// updater(
//   (state) => state.set((value) => ({ ...value, field: 'd' })),
//   (state) => state.child.set((value) => ({ ...value, field_1_1: 'd_1_1' })),
//   (state) =>
//     state.child.child_1_1.set((value) => ({ ...value, field_2_1: 'd_2_1' }))
// ).saveChanges();

// updater(
//   obj,
//   set(state, (value) => ({ ...value, field: 'd' })),
//   set(state.child, (value) => ({ ...value, field_1_1: 'd_1_1' })),
//   set(state.child.child_1_1, (value) => ({ ...value, field_2_1: 'd_2_1' }))
// ).saveChanges();

// updater.saveChanges();

// dobieranie się do wartości i nasłuchiwanie na zmiany
// const field1 = obj.select((val) => val.child.field_1_1);

// const field2 = obj.select((val) => val.child.child_1_1);

// watch();

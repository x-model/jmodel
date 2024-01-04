import {
  ExecutionContext,
  abstract,
  build,
  dependencies,
  fragments,
  fromFragments,
  hooks,
  methods,
  partial,
  partialBuilder,
  publicApi,
} from '@web-fragments/core';
import {
  CardCompare,
  CardMap,
  CardModel,
  CardRepository,
  draw$,
  totalPages$,
} from './card.fragment';
import { store$ } from './card-store.fragment';

export function partialCardModel() {
  return partial(
    // dependencies({
    //   cardRepository: cardRepositoryToken,
    //   compare: cardCompareToken,
    //   map: cardMapToken,
    // }),
    fragments({
      totalPages$,
    }),
    fromFragments({ store: (resolve) => resolve(store$) }),
    hooks(({ store }) => ({
      onDestroy: () => {
        console.log('destroying card model');
        store.destroy();
      },
    }))
    // memo(({ _exec }) => ({
    //   totalPages: () => _exec(totalPages$),
    //   store: () => cardStore(),
    // }))
  );
}

// const context = null;

// fragment powinien mieć też typ contextu, wtedy zabezpieczymy exec, jakby np. ktoś zapomniał czegoś zdefiniować,
// a np. będzie użyte we fragmencie

// export function publicCardModel(providers, model) {
//   return context({
//     providers,
//     internal: () => model,
//     public: ({ _exec, store }) => ({
//       state: store.state,
//       query: store.query,
//       draw: () => _exec(draw$),
//     }),
//   });
// }

// export function partialCardModel() /*: CardModel */ {
//   return build(
//     partialBuilder(),
//     dependencies({
//       cardRepository: abstract<CardRepository>(),
//     }),
//     fragments({
//       totalPages$,
//     }),
//     methods(() => ({
//       compare: abstract<CardCompare>(),
//       map: abstract<CardMap>(),
//     })),
//     fromFragments({ store: (resolve) => resolve(store$) }),
//     publicApi(({ _exec, store }) => ({
//       state: store.state,
//       query: store.query,
//       draw: () => _exec(draw$),
//     }))
//   );
// }

// export abstract class CardModel extends ExecutionContext {
//   abstract compare(): void;
//   abstract map(): void;

//   private totalPages$;
//   private cardRepository = _inject(CardRepository);
//   private store = exec(store$);
//   state = this.store.state;
//   query = this.store.query;

//   onDestroy() {
//     console.log('destroying card model');
//     this.store.destroy();
//   }

//   draw() {
//     _exec(draw$);
//   }
// }
// TODO
// Pytanie czy dla każdego resource on się powinien na nowo tworzyć? w sumie tutaj się chyba wywołuje definicja
// ale czemu np abstract się wywoływało na starcie apki? jak było const cardModel?
export function cardModel() /*: CardModel */ {
  return build(
    partialBuilder(),
    dependencies({
      cardRepository: abstract<CardRepository>(),
    }),
    fragments({
      totalPages$,
    }),
    methods(() => ({
      compare: abstract<CardCompare>(),
      map: abstract<CardMap>(),
    })),
    fromFragments({ store: (resolve) => resolve(store$) }),
    hooks(({ store }) => ({
      onDestroy: () => {
        console.log('destroying card model');
        store.destroy();
      },
    })),
    publicApi(({ _exec, store }) => ({
      // ...store.getters
      // isLoading: store.isLoading,
      // player1: store.player1,
      // // player2: store.player2,
      // onDestroy: () => {
      //   console.log('destroying card model');
      //   store.destroy();
      // },
      state: store.state,
      query: store.query,
      draw: () => _exec(draw$),
    }))
  );
}

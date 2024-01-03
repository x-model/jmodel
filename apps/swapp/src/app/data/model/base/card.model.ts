import {
  abstract,
  build,
  dependencies,
  fragments,
  fromFragments,
  hooks,
  methods,
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
      // player2: store.player2,
      state: store.state,
      query: store.query,
      draw: () => _exec(draw$),
    }))
  );
}

import {
  abstract,
  build,
  dependencies,
  fragments,
  fromFragments,
  methods,
  partialBuilder,
  publicApi,
} from '@web-fragments/ng-fragments';
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
    publicApi(({ _exec, store }) => ({
      // ...store.getters
      isLoading: store.isLoading,
      player1: store.player1,
      player2: store.player2,
      draw: () => _exec(draw$),
    }))
  );
}

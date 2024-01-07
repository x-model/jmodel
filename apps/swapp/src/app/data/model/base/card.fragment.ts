import { InjectionToken } from '@angular/core';
import { ExecutionContext, fragment, memoFragment } from '@web-fragments/core';
import { ApiResult } from '@web-fragments/ng-fragments';
import { getRandom } from '../../../common';
import { CollectionParams } from '../../repositories/base/models/collection-params';
import { CollectionResult } from '../../repositories/base/models/collection-result';
import { Card } from './models/card';
import { CardStore } from './card-store';
import { CardModel } from './card.model';

// Czy to powinno być w modelu czy w repository?
// W sumie to już jest jakaś logika, to już jest obróbka danych z data sources
// w repositories też by to mogło być tylko zrobiliśmy repository jako singleton
// repository powinno się traktować jak dawne api serwisy?
export const totalPages$ = memoFragment(
  async ({ cardRepository }: InternalCardModel) => {
    const { data, error } = await cardRepository.getAll({
      page: 1,
      limit: 1,
    });
    return error ? 0 : data?.totalPages;
  }
);

export type CardRepository = {
  getAll: (input: CollectionParams) => Promise<ApiResult<CollectionResult>>;
  get: (input: number) => Promise<ApiResult<unknown>>;
};

export type CardCompare = ([card1, card2]: [Card, Card]) => number;
export type CardMap = (model: unknown) => Card;

export type InternalCardModel = {
  store: CardStore;
  cardRepository: CardRepository;
  totalPages: () => Promise<number>;
  compare: CardCompare;
  map: CardMap;
} & ExecutionContext;

export type CardComponentContext = {
  model: CardModel;
  // isLoading: Signal<boolean>;
  // player1: Signal<CardPlayer>;
  // player2: Signal<CardPlayer>;
  // // model: { store: FragmentResultType<typeof store$> };
  // draw: () => void;
  // changeName: () => void;
  // formModel: { name: string; errors: { name: string } };
};

export const CARD_COMPONENT_CONTEXT = new InjectionToken<CardComponentContext>(
  'CARD_COMPONENT_CONTEXT'
);

// przydałoby się resolverować te fragmenty, wtedy nikt się nie pomyli z wywołaniem
// wtedy nikt nie wywoła _exec(totalPages$) jak fragment jest zarejestrowany, a np. zapomniał wstrzyknąć,
// bo wtedy wykonuje tego niezarejestrowanego z góry i już jest bug który ciężko ogarnąć co jest problem
// że zapomniało się wyciągnąć z context
const getCard$ = fragment(
  async ({ totalPages, cardRepository, map }: InternalCardModel) => {
    const total = await totalPages();
    const { data: resourceResult } = await cardRepository.getAll({
      page: getRandomPage(total),
      limit: 1,
    });

    const itemId = resourceResult?.items?.[0]?.uid;

    if (itemId && !isNaN(+itemId)) {
      const { data: resourceItemResult } = await cardRepository.get(+itemId);
      return map(resourceItemResult);
    } else {
      return null;
    }
  }
);

export const draw$ = fragment(
  async ({ _exec, store, compare }: InternalCardModel) => {
    store.draw();
    // store.update(draw());

    const [card1, card2] = await Promise.all([
      _exec(getCard$),
      _exec(getCard$),
    ]);

    if (card1 && card2) {
      const winner = compare([card1, card2]);
      store.drawSuccess([card1, card2], winner);
    } else {
      store.drawFailure();
    }
  }
);

const getRandomPage = (range: number): number => {
  return getRandom(1, range);
};

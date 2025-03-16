import { FACTORY, Lifetime, LIFETIME, PROVIDERS, TOKEN } from '@x-model/jmodel';
import { starshipGet, starshipGetAll } from './starship.resource';
import { compareStarships } from './utils/starship-comparer';
import { mapStarship } from './utils/starship-mapper';
import { CARD_COMPARE, CARD_MAP, CARD_REPOSITORY } from '../base/di-tokens';
import { CARD_STORE, cardStore } from '../base/card.store';
import { cardSourceFactory } from '../base/card.model';

export const starshipSource = {
  [TOKEN]: Symbol('STARSHIP_SOURCE'),
  [LIFETIME]: Lifetime.scoped,
  [PROVIDERS]: {
    [CARD_REPOSITORY]: {
      [FACTORY]: () => ({
        getAll: starshipGetAll,
        get: starshipGet,
      }),
    },
    [CARD_STORE]: cardStore,
    [CARD_COMPARE]: () => compareStarships,
    [CARD_MAP]: () => mapStarship,
  },
  [FACTORY]: cardSourceFactory,
};

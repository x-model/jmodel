import {
  FACTORY,
  LIFETIME,
  Lifetime,
  PROVIDERS,
  TOKEN,
} from '@web-fragments/core';
import { comparePeople } from './utils/people-comparer';
import { mapPeople } from './utils/people-mapper';
import { CARD_STORE, cardStore } from '../base/card.store';
import { CARD_COMPARE, CARD_MAP, CARD_REPOSITORY } from '../base/di-tokens';
import { peopleRepository } from './people.repository';
import { cardSourceFactory } from '../base/card.model';

export const peopleSource = {
  [TOKEN]: Symbol('PEOPLE_SOURCE'),
  [LIFETIME]: Lifetime.scoped,
  [PROVIDERS]: {
    [CARD_REPOSITORY]: peopleRepository,
    [CARD_STORE]: cardStore,
    [CARD_COMPARE]: () => comparePeople,
    [CARD_MAP]: () => mapPeople,
  },
  [FACTORY]: cardSourceFactory,
};

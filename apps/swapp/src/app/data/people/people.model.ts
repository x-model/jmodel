import {
  FACTORY,
  LIFETIME,
  Lifetime,
  PROVIDERS,
  TOKEN,
} from '@web-fragments/core';
import { comparePeople } from './people-comparer';
import { mapPeople } from './people-mapper';
import { CARD_COMPARE, CARD_MAP, REPOSITORY } from '../base/di-tokens';
import { peopleRepository } from './people.repository';
import { CARD_STORE, cardStore } from '../base/card-store';
import { sourceFactory } from '../base/models/card-context';
import { createModel } from 'libs/core/src/reactive-model/model';

export const peopleSource = {
  [TOKEN]: Symbol('PEOPLE_SOURCE'),
  [LIFETIME]: Lifetime.scoped,
  [PROVIDERS]: {
    // [MEMO]: {
    //   totalPages$,
    // },
    [REPOSITORY]: peopleRepository,
    [CARD_STORE]: cardStore,
    [CARD_COMPARE]: () => comparePeople,
    [CARD_MAP]: () => mapPeople,
  },
  [FACTORY]: sourceFactory,
};

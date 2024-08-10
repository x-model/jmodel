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
import { CARD_STORE, cardStore } from '../base/card-store';
import { sourceFactory } from '../base/models/card-context';
import {
  peopleGet,
  peopleGetAll,
} from '../../data-sources/people/people.data-source';

export const peopleSource = {
  [TOKEN]: Symbol('PEOPLE_SOURCE'),
  [LIFETIME]: Lifetime.scoped,
  [PROVIDERS]: {
    // [MEMO]: {
    //   totalPages$,
    // },
    [REPOSITORY]: {
      [FACTORY]: () => ({
        getAll: peopleGetAll,
        get: peopleGet,
      }),
    },
    [CARD_STORE]: cardStore,
    [CARD_COMPARE]: () => comparePeople,
    [CARD_MAP]: () => mapPeople,
  },
  [FACTORY]: sourceFactory,
};

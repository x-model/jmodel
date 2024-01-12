import { Context, DEPENDENCIES, asScoped, context } from '@web-fragments/core';
import { comparePeople } from './people-comparer';
import { mapPeople } from './people-mapper';
import { CardModel, partialCardModel } from '../base/card.model';
import {
  cardCompareToken,
  cardMapToken,
  cardModelToken,
} from '../base/di-tokens';
import { peopleRepository } from './people.repository';

export const peopleModelResolver = () =>
  asScoped(cardModelToken, peopleModelFactory);

export const peopleModelFactory = (): Context<CardModel> =>
  context({
    ...partialCardModel,
    [DEPENDENCIES]: {
      ...partialCardModel[DEPENDENCIES],
      _cardRepository: peopleRepository,
      _compare: () => asScoped(cardCompareToken, () => comparePeople),
      _map: () => asScoped(cardMapToken, () => mapPeople),
    },
  });

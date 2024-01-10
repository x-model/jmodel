import { Context, asScoped } from '@web-fragments/core';
import { peopleRepositoryResolver } from '../people/people.repository';
import { comparePeople } from './people-comparer';
import { mapPeople } from './people-mapper';
import { CardModel, cardModel } from '../base/card.model';
import {
  cardCompareToken,
  cardMapToken,
  cardModelToken,
} from '../base/di-tokens';

export const peopleModelResolver = () =>
  asScoped(cardModelToken, peopleModelFactory);

export const peopleModelFactory = (): Context<CardModel> =>
  cardModel({
    _cardRepository: peopleRepositoryResolver,
    _compare: () => asScoped(cardCompareToken, () => comparePeople),
    _map: () => asScoped(cardMapToken, () => mapPeople),
  });

import { Context, fromFactory, perLifetimeScope } from '@web-fragments/core';
import { resolvePeopleRepository } from '../../repositories/people/people.repository';
import { comparePeople } from './services/people-comparer';
import { mapPeople } from './services/people-mapper';
import { CardModel, cardModel } from '../base/card.model';
import {
  cardCompareToken,
  cardMapToken,
  cardModelToken,
} from '../base/di-tokens';

export const resolvePeopleModel = () =>
  perLifetimeScope(cardModelToken, fromFactory(peopleModelFactory));

export const peopleModelFactory = (): Context<CardModel> =>
  cardModel({
    cardRepository: resolvePeopleRepository(),
    compare: perLifetimeScope(cardCompareToken, () => comparePeople),
    map: perLifetimeScope(cardMapToken, () => mapPeople),
  });

import { injectionToken } from '@web-fragments/core';
import { CardCompare, CardMap, CardRepository } from './card.fragment';
import { CardStore } from './card-store';
import { CardModel } from './card.model';

export const cardStoreToken = injectionToken<CardStore>('cardStore');

export const cardRepositoryToken =
  injectionToken<CardRepository>('cardRepository');

export const cardModelToken = injectionToken<CardModel>('cardModel');

export const cardCompareToken = injectionToken<CardCompare>('cardCompareToken');

export const cardMapToken = injectionToken<CardMap>('cardMapToken');

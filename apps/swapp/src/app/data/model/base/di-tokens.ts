import { injectionToken } from '@web-fragments/core';
import {
  CardCompare,
  CardMap,
  CardModel,
  CardRepository,
} from './card.fragment';

export const cardRepositoryToken =
  injectionToken<CardRepository>('cardRepository');

export const cardModelToken = injectionToken<CardModel>('cardModel');

export const cardCompareToken = injectionToken<CardCompare>('cardCompareToken');

export const cardMapToken = injectionToken<CardMap>('cardMapToken');

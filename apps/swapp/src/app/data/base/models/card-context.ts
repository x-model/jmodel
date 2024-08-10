import { ApiResult, Context, FactoryResult } from '@web-fragments/core';
import { CollectionParams } from '../../../data-sources/base/models/collection-params';
import { CollectionResult } from '../../../data-sources/base/models/collection-result';
import { Card } from './card';
import { draw } from '../card.fragment';
import { CARD_STORE } from '../card-store';

export type CardRepository = {
  getAll: (input: CollectionParams) => Promise<ApiResult<CollectionResult>>;
  get: (input: number) => Promise<ApiResult<unknown>>;
};

export type CardCompare = ([card1, card2]: [Card, Card]) => number;
export type CardMap = (model: unknown) => Card;

export const sourceFactory = ({ inject }: Context) => ({
  draw,
  signals: inject(CARD_STORE).signals,
});

export type CardContext = {
  model: FactoryResult<typeof sourceFactory>;
};

import { ApiResult } from '@x-model/jmodel';
import { Card } from './card';
import { CollectionParams } from '../../../common/resources/models/collection-params';
import { CollectionResult } from '../../../common/resources/models/collection-result';

export type CardRepository = {
  getAll: (input: CollectionParams) => Promise<ApiResult<CollectionResult>>;
  get: (input: number) => Promise<ApiResult<unknown>>;
};

export type CardCompare = ([card1, card2]: [Card, Card]) => number;
export type CardMap = (model: unknown) => Card;

export type CardModel = {
  draw: () => Promise<void>;
  refs: {
    isLoading: any;
    player1: any;
    player2: any;
  };
};

export type CardContext = {
  model: CardModel;
};

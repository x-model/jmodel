import { Token } from '@web-fragments/core';
import { CardCompare, CardMap, CardRepository } from './models/card-context';

export const CARD_REPOSITORY = Token<CardRepository>('CARD_REPOSITORY');
export const CARD_COMPARE = Token<CardCompare>('CARD_COMPARE');
export const CARD_MAP = Token<CardMap>('CARD_MAP');

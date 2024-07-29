import { Token } from '@web-fragments/core';
import { CardCompare, CardMap, CardRepository } from './models/card-context';

export const REPOSITORY: Token<CardRepository> = Symbol('CARD_REPOSITORY');
export const CARD_COMPARE: Token<CardCompare> = Symbol('CARD_COMPARE');
export const CARD_MAP: Token<CardMap> = Symbol('CARD_MAP');

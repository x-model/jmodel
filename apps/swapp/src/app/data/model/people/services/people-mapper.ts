import { PeopleDetailResult } from '../../../repositories/people';
import { camelToSnake } from '../../../../common';
import { Card, CardProperty } from '../../base/models/card';
import { PeopleProps } from '../models/people-props';

const cardPropertyKeys: PeopleProps[] = ['eyeColor', 'mass', 'gender'];

export const mapPeople = (model: PeopleDetailResult): Card => {
  if (!model) {
    return null;
  }

  return {
    title: model.name,
    properties: cardPropertyKeys.reduce(
      (prev, key: PeopleProps) => ({
        ...prev,
        [key]: mapToCardProperty(key, model[key]),
      }),
      {}
    ),
  };
};

const mapToCardProperty = (key: PeopleProps, value: unknown): CardProperty => {
  return {
    translationKey: getTranslationKey(key),
    value: getValue(value),
    rawValue: value,
  };
};

const getTranslationKey = (key: PeopleProps): string => {
  const translationKey = camelToSnake(key).toUpperCase();

  return `CARDS.PEOPLE.${translationKey}`;
};

const getValue = <T>(value: T): string => {
  return value?.toString();
};

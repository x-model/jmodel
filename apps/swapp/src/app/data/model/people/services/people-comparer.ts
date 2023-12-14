import { convertStringNumberToNumber } from '../../../../common';
import { Card } from '../../base/models/card';
import { PeopleProps } from '../models/people-props';

const scorePropertyKeys: PeopleProps[] = ['mass'];

export const comparePeople = ([card1, card2]: [Card, Card]): number => {
  const card1Points = getPoints(card1);
  const card2Points = getPoints(card2);

  if (card1Points === card2Points) {
    return 0;
  }

  return card1Points > card2Points ? 1 : -1;
};

const getPoints = (card: Card): number => {
  return scorePropertyKeys.reduce((result, key) => {
    if (key === 'mass') {
      return (
        result +
        convertStringNumberToNumber(card.properties[key].rawValue as string)
      );
    } else {
      return result;
    }
  }, 0);
};

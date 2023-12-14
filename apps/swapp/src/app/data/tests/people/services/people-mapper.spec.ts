import { PeopleDetailResult } from '../../../repositories/people';
import { mapPeople } from '../../../model/people/services/people-mapper';

describe('people mapper', () => {
  describe('map', () => {
    it('return null if model is null or undefined', () => {
      expect(mapPeople(null)).toBe(null);
      expect(mapPeople(undefined)).toBe(null);
    });

    it('map PeopleDetailResult without any common attribute to Card', () => {
      const model = {
        name: 'Shmi Skywalker',
      } as PeopleDetailResult;

      const expectedModel = {
        title: 'Shmi Skywalker',
        properties: {
          eyeColor: {
            translationKey: 'CARDS.PEOPLE.EYE_COLOR',
            value: undefined,
            rawValue: undefined,
          },
          gender: {
            translationKey: 'CARDS.PEOPLE.GENDER',
            value: undefined,
            rawValue: undefined,
          },
          mass: {
            translationKey: 'CARDS.PEOPLE.MASS',
            value: undefined,
            rawValue: undefined,
          },
        },
      };

      expect(mapPeople(model)).toEqual(expectedModel);
    });

    it('map PeopleDetailResult with all common attributes to Card', () => {
      const model = {
        mass: '40',
        eyeColor: 'brown',
        gender: 'male',
        name: 'Shmi Skywalker',
      } as PeopleDetailResult;

      const expectedModel = {
        title: 'Shmi Skywalker',
        properties: {
          eyeColor: {
            translationKey: 'CARDS.PEOPLE.EYE_COLOR',
            value: 'brown',
            rawValue: 'brown',
          },
          gender: {
            translationKey: 'CARDS.PEOPLE.GENDER',
            value: 'male',
            rawValue: 'male',
          },
          mass: {
            translationKey: 'CARDS.PEOPLE.MASS',
            value: '40',
            rawValue: '40',
          },
        },
      };

      expect(mapPeople(model)).toEqual(expectedModel);
    });
  });
});

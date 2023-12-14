import { compareStarships } from '../../../model/starship/services/starship-comparer';

describe('starship comparer', () => {
  it('return 0 when card1.crew is unknown and card2.crew is equal 0', () => {
    const card1 = {
      title: '',
      properties: {
        crew: { translationKey: '', value: '', rawValue: 'unknown' },
      },
    };
    const card2 = {
      title: '',
      properties: { crew: { translationKey: '', value: '', rawValue: '0' } },
    };
    const result = compareStarships([card1, card2]);

    expect(result).toBe(0);
  });

  it('return -1 when card1.crew is lower than card2.crew', () => {
    const card1 = {
      title: '',
      properties: { crew: { translationKey: '', value: '', rawValue: '20' } },
    };
    const card2 = {
      title: '',
      properties: { crew: { translationKey: '', value: '', rawValue: '40' } },
    };
    const result = compareStarships([card1, card2]);

    expect(result).toBe(-1);
  });

  it('return 0 when card1.crew is equal to card2.crew', () => {
    const card1 = {
      title: '',
      properties: { crew: { translationKey: '', value: '', rawValue: '40' } },
    };
    const card2 = {
      title: '',
      properties: { crew: { translationKey: '', value: '', rawValue: '40' } },
    };
    const result = compareStarships([card1, card2]);

    expect(result).toBe(0);
  });

  it('return 1 when card1.crew is greater than card2.crew', () => {
    const card1 = {
      title: '',
      properties: { crew: { translationKey: '', value: '', rawValue: '60' } },
    };
    const card2 = {
      title: '',
      properties: { crew: { translationKey: '', value: '', rawValue: '40' } },
    };
    const result = compareStarships([card1, card2]);

    expect(result).toBe(1);
  });
});

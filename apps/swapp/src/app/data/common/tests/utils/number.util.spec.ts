import { getRandom } from '../../utils/number.util';

describe('getRandom', () => {
  let mathRandomSpy: jest.Spied<typeof Math.random>;

  beforeEach(() => {
    mathRandomSpy = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('return 1 when start is 1 and end is 1', () => {
    mathRandomSpy.mockReturnValue(0);
    const result1 = getRandom(1, 1);
    expect(mathRandomSpy).toReturnWith(0);
    expect(result1).toBe(1);

    mathRandomSpy.mockReturnValue(1);
    const result2 = getRandom(1, 1);
    expect(mathRandomSpy).toReturnWith(1);
    expect(result2).toBe(1);
  });

  it('return 1 when start is 1 and end is 2 (random: 0)', () => {
    mathRandomSpy.mockReturnValue(0);
    const result = getRandom(1, 2);
    expect(mathRandomSpy).toReturnWith(0);
    expect(result).toBe(1);
  });

  it('return 2 when start is 1 and end is 2 (random: 1)', () => {
    mathRandomSpy.mockReturnValue(1);
    const result = getRandom(1, 2);
    expect(mathRandomSpy).toReturnWith(1);
    expect(result).toBe(2);
  });

  it('return 1 when start is 1 and end is 2 (random: 0.55)', () => {
    mathRandomSpy.mockReturnValue(0.55);
    const result = getRandom(1, 2);
    expect(mathRandomSpy).toReturnWith(0.55);
    expect(result).toBe(1);
  });
});

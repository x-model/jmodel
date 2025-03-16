import {
  camelToSnake,
  convertStringNumberToNumber,
  snakeToCamel,
} from '../../utils/map.util';

describe('map util', () => {
  describe('convertStringNumberToNumber', () => {
    it('return 0 when input is "unknown" or "n/a"', () => {
      const resultUnknown = convertStringNumberToNumber('unknown');
      const resultNA = convertStringNumberToNumber('n/a');
      expect(resultUnknown).toBe(0);
      expect(resultNA).toBe(0);
    });

    it('return 0 when input is "0"', () => {
      const result = convertStringNumberToNumber('0');
      expect(result).toBe(0);
    });

    it('return 1350 when input is "1,350"', () => {
      const result = convertStringNumberToNumber('1,350');
      expect(result).toBe(1350);
    });

    it('return 1350.43 when input is "1,350.43"', () => {
      const result = convertStringNumberToNumber('1,350.43');
      expect(result).toBe(1350.43);
    });

    it('return 1350.43 when input is "1 350,43" and locale is pl-PL', () => {
      const result = convertStringNumberToNumber('1 350,43', 'pl-PL');
      expect(result).toBe(1350.43);
    });
  });

  describe('camelToSnake', () => {
    it('convert string from camelCase to snake_case', () => {
      expect(snakeToCamel('')).toBe('');
      expect(camelToSnake('totalpages')).toBe('totalpages');
      expect(camelToSnake('eyeColor')).toBe('eye_color');
      expect(camelToSnake('eyeColor22')).toBe('eye_color_2_2');
    });
  });

  describe('snakeToCamel', () => {
    it('convert string from snake_case to camelCase', () => {
      expect(snakeToCamel('')).toBe('');
      expect(snakeToCamel('totalpages')).toBe('totalpages');
      expect(snakeToCamel('eye_color')).toBe('eyeColor');
      expect(snakeToCamel('eye_color_22')).toBe('eyeColor22');
      expect(snakeToCamel('EYE_COLOR_22')).toBe('eyeColor22');
    });
  });
});

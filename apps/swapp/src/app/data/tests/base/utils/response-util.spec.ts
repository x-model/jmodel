import { mapResponseToCamelCase } from '../../../repositories/base/utils/response.util';

/*eslint-disable @typescript-eslint/naming-convention*/
describe('mapResponseToCamelCase', () => {
  it('return null when object is null', () => {
    const obj = null;
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = null;

    expect(mappedObj).toEqual(expectedResult);
  });

  it('return undefined when object is undefined', () => {
    const obj = undefined;
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = undefined;

    expect(mappedObj).toEqual(expectedResult);
  });

  it('return empty object when input object is empty', () => {
    const obj = {};
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = {};

    expect(mappedObj).toEqual(expectedResult);
  });

  it('map object props (primitive types) from snake_case to camelCase', () => {
    const obj = { total_pages: '1', total_items: '2' };
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = { totalPages: '1', totalItems: '2' };

    expect(mappedObj).toEqual(expectedResult);
  });

  it('map object props to camelCase (different variations for prop names)', () => {
    const obj = {
      totalpages: '1',
      EYE_COLOR_1: 'brown 1',
      eye_color_22: 'brown 2',
      E2E: 'E2E',
      i18n: 'i18n',
      i18n_22: 'i18n22',
      _id: '1',
      __v: '2',
    };
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = {
      totalpages: '1',
      eyeColor1: 'brown 1',
      eyeColor22: 'brown 2',
      e2e: 'E2E',
      i18n: 'i18n',
      i18n22: 'i18n22',
      Id: '1',
      _V: '2',
    };

    expect(mappedObj).toEqual(expectedResult);
  });

  it('map object props from snake_case to camelCase when field include empty object', () => {
    const obj = { message: 'test', people_result: {} };
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = { message: 'test', peopleResult: {} };

    expect(mappedObj).toEqual(expectedResult);
  });

  it('map object props from snake_case to camelCase when field include object', () => {
    const obj = {
      message: 'test',
      people_result: { eye_color: 'brown', mass: '1,200' },
    };
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = {
      message: 'test',
      peopleResult: { eyeColor: 'brown', mass: '1,200' },
    };

    expect(mappedObj).toEqual(expectedResult);
  });

  it('map object props from snake_case to camelCase when field include empty array', () => {
    const obj = { message: 'test', results: [] };
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = { message: 'test', results: [] };

    expect(mappedObj).toEqual(expectedResult);
  });

  it('map array with primitive types', () => {
    const obj = ['apple', 'banana'];
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = ['apple', 'banana'];

    expect(mappedObj).toEqual(expectedResult);
  });

  it('map objects props included in array from snake_case to camelCase', () => {
    const obj = [
      {
        message: 'test',
        starships: ['starship1', 'starship2'],
        results: [{ eye_color: 'brown', info: { skin_color: 'unknown' } }],
      },
      {
        message: 'test2',
        starships: ['starship1'],
        users: [{ eye_color: 'red', info: { skin_color: 'unknown' } }],
      },
    ];
    const mappedObj = mapResponseToCamelCase(obj);
    const expectedResult = [
      {
        message: 'test',
        starships: ['starship1', 'starship2'],
        results: [{ eyeColor: 'brown', info: { skinColor: 'unknown' } }],
      },
      {
        message: 'test2',
        starships: ['starship1'],
        users: [{ eyeColor: 'red', info: { skinColor: 'unknown' } }],
      },
    ];

    expect(mappedObj).toEqual(expectedResult);
  });
});

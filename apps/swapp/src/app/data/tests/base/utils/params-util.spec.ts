import { HttpParams } from '@angular/common/http';
import { getCollectionParams } from '../../../repositories/base/utils/params.util';

describe('getCollectionParams', () => {
  it('return null if params are null, undefined or empty object', () => {
    expect(getCollectionParams(null)).toBe(null);
    expect(getCollectionParams(undefined)).toBe(null);
    expect(getCollectionParams({})).toBe(null);
  });

  it('return HttpParams', () => {
    const params = { page: 1, limit: 2 };
    const expectedParams = new HttpParams({ fromObject: params });

    expect(getCollectionParams(params)).toEqual(expectedParams);
  });
});

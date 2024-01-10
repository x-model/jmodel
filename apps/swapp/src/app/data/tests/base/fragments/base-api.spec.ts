import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { build, fragments, methods } from '@web-fragments/core';
import { ContextType, ngContextBuilder } from '@web-fragments/ng-fragments';
import {
  baseGet,
  baseGetAll,
} from '../../../../data-sources/base/base-data-source';

const FakeContext = build(
  ngContextBuilder(),
  fragments({
    getAll$: baseGetAll(''),
    get$: baseGet(''),
  }),
  methods(({ _exec, get$, getAll$ }) => ({
    get: () => _exec(get$),
    getAll: () => _exec(getAll$),
  }))
);

/*eslint-disable @typescript-eslint/naming-convention*/
describe('BaseApiService', () => {
  let fakeContext: ContextType<typeof FakeContext>;
  const fakeHttpClient = { get: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: fakeHttpClient },
        FakeContext,
      ],
    });

    fakeContext = TestBed.inject(FakeContext);
  });

  describe('adaptToDetailResult', () => {
    it('return null if model is null or undefined', async () => {
      const expectedResult = {
        data: null,
        error: null,
      };

      fakeHttpClient.get.mockReturnValue(of(null));
      await expect(fakeContext.get()).resolves.toEqual(expectedResult);

      fakeHttpClient.get.mockReturnValue(of(undefined));
      await expect(fakeContext.get()).resolves.toEqual(expectedResult);
    });

    it('return undefined if model has no result', fakeAsync(async () => {
      const model = {
        message: 'test',
      };

      const expectedResult = {
        data: undefined,
        error: null,
      };

      fakeHttpClient.get.mockReturnValue(of(model));
      await expect(fakeContext.get()).resolves.toEqual(expectedResult);
    }));

    it('return model only with id if model has no properties', async () => {
      const model = {
        message: 'test',
        result: {
          uid: '1',
        },
      };

      const expectedResult = {
        data: { id: '1' },
        error: null,
      };

      fakeHttpClient.get.mockReturnValue(of(model));
      await expect(fakeContext.get()).resolves.toEqual(expectedResult);
    });

    it('return adapted model with id and convertedProperties (from snake_case to camel_case)', async () => {
      const model = {
        message: 'test',
        result: {
          properties: {
            eye_color: 'brown',
            gender: 'male',
          },
          description: 'description',
          _id: '1',
          uid: '2',
          __v: '3',
        },
      };

      const expectedResult = {
        data: {
          id: '2',
          eyeColor: 'brown',
          gender: 'male',
        },
        error: null,
      };

      fakeHttpClient.get.mockReturnValue(of(model));
      await expect(fakeContext.get()).resolves.toEqual(expectedResult);
    });
  });

  describe('adaptToCollectionResult', () => {
    it('return null if model is null or undefined', async () => {
      const expectedResult = {
        data: null,
        error: null,
      };

      fakeHttpClient.get.mockReturnValue(of(null));
      await expect(fakeContext.getAll()).resolves.toEqual(expectedResult);

      fakeHttpClient.get.mockReturnValue(of(undefined));
      await expect(fakeContext.getAll()).resolves.toEqual(expectedResult);
    });

    it('return adapted model if model has no results', async () => {
      const model = {
        message: 'test',
      };

      const expectedResult = {
        data: {
          totalItems: 0,
          totalPages: 0,
          items: [],
        },
        error: null,
      };

      fakeHttpClient.get.mockReturnValue(of(model));
      await expect(fakeContext.getAll()).resolves.toEqual(expectedResult);
    });

    it('return adapted model', async () => {
      const model = {
        message: 'test',
        total_records: 2,
        total_pages: 1,
        previous: '',
        next: '',
        results: [
          { uid: '1', name: 'item 1', url: '' },
          { uid: '2', name: 'item 2', url: '' },
        ],
      };

      const expectedResult = {
        data: {
          totalItems: 2,
          totalPages: 1,
          items: [
            { uid: '1', name: 'item 1', url: '' },
            { uid: '2', name: 'item 2', url: '' },
          ],
        },
        error: null,
      };

      fakeHttpClient.get.mockReturnValue(of(model));
      await expect(fakeContext.getAll()).resolves.toEqual(expectedResult);
    });
  });
});

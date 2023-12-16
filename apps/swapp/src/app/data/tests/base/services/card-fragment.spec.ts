import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { build, fragment, fragments, methods } from '@web-fragments/core';
import { ContextType, ngContextBuilder } from '@web-fragments/ng-fragments';
import { cards, resourceItems } from './data';
import {
  CardComponentContext,
  draw$,
  totalPages$,
} from '../../../model/base/card.fragment';
import { store$ } from '../../../model/base/card-store.fragment';

const resolveDelay = (delay: number, data: any) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(data);
    }, delay)
  );

describe('card fragments', () => {
  describe('totalPagesFragment', () => {
    const FakeContext: Type<
      Pick<CardComponentContext, '_exec' | 'getAll$' | 'totalPages$'>
    > = build(
      ngContextBuilder(),
      fragments({
        getAll$: fragment(() =>
          Promise.resolve({ data: resourceItems, error: null })
        ),
        totalPages$,
      })
    );

    let fakeContext: ContextType<typeof FakeContext>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [FakeContext],
      });

      fakeContext = TestBed.inject(FakeContext);
    });

    it('return 0 when throw api error', async () => {
      const expectedResult = 0;

      jest
        .spyOn(fakeContext.getAll$, 'execute')
        .mockReturnValue(
          Promise.resolve({ data: null, error: new Error('error') })
        );

      await expect(fakeContext._exec(fakeContext.totalPages$)).resolves.toEqual(
        expectedResult
      );
    });

    it('fetched data from api once', async () => {
      const getAllSpy = jest.spyOn(fakeContext.getAll$, 'execute');
      const expectedResult = resourceItems.totalPages;

      await expect(fakeContext._exec(fakeContext.totalPages$)).resolves.toEqual(
        expectedResult
      );

      await expect(fakeContext._exec(fakeContext.totalPages$)).resolves.toEqual(
        expectedResult
      );

      expect(getAllSpy.mock.calls.length).toBe(1);
    });

    it('return totalPages', async () => {
      const expectedResult = resourceItems.totalPages;

      await expect(fakeContext._exec(fakeContext.totalPages$)).resolves.toEqual(
        expectedResult
      );
    });
  });

  describe('drawFragment', () => {
    const FakeContext: Type<
      CardComponentContext & { compare: jest.Mock; map: jest.Mock }
    > = build(
      ngContextBuilder(),
      fragments({
        store$,
        getAll$: fragment(() =>
          Promise.resolve({ data: resourceItems, error: null })
        ),
        get$: fragment(() => Promise.resolve({ data: cards[0], error: null })),
        totalPages$,
      }),
      methods(({ store$, _exec }) => ({
        draw: () => _exec(draw$),
        compare: jest.fn(),
        map: jest.fn(),
        getStore: () => _exec(store$),
      }))
    );

    let fakeContext: ContextType<typeof FakeContext>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [FakeContext],
      });

      fakeContext = TestBed.inject(FakeContext);
    });

    it('set initial state', () => {
      const expectedResult = {
        player1: { score: 0, isLoading: false, win: false },
        player2: { score: 0, isLoading: false, win: false },
      };

      expect(fakeContext.getStore().state()).toEqual(expectedResult);
    });

    it('set state when draw failure', async () => {
      const expectedResult = {
        a: {
          player1: { score: 0, isLoading: true, win: false, card: null },
          player2: { score: 0, isLoading: true, win: false, card: null },
        },
        b: {
          player1: { score: 0, isLoading: false, win: false, card: null },
          player2: { score: 0, isLoading: false, win: false, card: null },
        },
      };

      jest
        .spyOn(fakeContext.getAll$, 'execute')
        .mockReturnValue(
          resolveDelay(10, { data: null, error: new Error('error') }) as any
        );

      const drawResult = fakeContext.draw();
      expect(fakeContext.getStore().state()).toEqual(expectedResult.a);

      await drawResult;

      expect(fakeContext.getStore().state()).toEqual(expectedResult.b);
    });

    it('set state when draw success', async () => {
      const expectedResult = {
        a: {
          player1: { score: 0, isLoading: true, win: false, card: null },
          player2: { score: 0, isLoading: true, win: false, card: null },
        },
        b: {
          player1: { score: 0, isLoading: false, win: false, card: cards[0] },
          player2: { score: 1, isLoading: false, win: true, card: cards[1] },
        },
      };

      const getAllSpy = jest
        .spyOn(fakeContext.getAll$, 'execute')
        .mockReturnValue(
          resolveDelay(10, {
            data: {
              items: [{ uid: '1' } as any],
              totalPages: 1,
              totalItems: 1,
            },
            error: null,
          }) as any
        );

      const getSpy = jest
        .spyOn(fakeContext.get$, 'execute')
        .mockReturnValue(Promise.resolve({ data: {} as any, error: null }));

      fakeContext.compare.mockReturnValue(-1);
      fakeContext.map
        .mockReturnValueOnce(cards[0])
        .mockReturnValueOnce(cards[1]);

      const drawResult = fakeContext.draw();
      expect(fakeContext.getStore().state()).toEqual(expectedResult.a);
      await drawResult;
      expect(fakeContext.getStore().state()).toEqual(expectedResult.b);

      expect(getAllSpy.mock.calls.length).toBe(3);
      expect(getSpy.mock.calls.length).toBe(2);
    });
  });
});

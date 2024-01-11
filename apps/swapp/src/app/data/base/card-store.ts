import {
  createReactiveModel,
  createGraph,
  asScoped,
  InjectionDef,
  ReactiveModel,
} from '@web-fragments/core';
import { CardPlayer } from './models/card-player';
import { Card } from './models/card';
import { cardStoreToken } from './di-tokens';

interface CardState {
  player1: CardPlayer;
  player2: CardPlayer;
}

export type CardStore = ReturnType<typeof cardStoreFactory>;

const initialState: CardState = {
  player1: { score: 0, isLoading: false, win: false },
  player2: { score: 0, isLoading: false, win: false },
};

const graph = createGraph(initialState);
const { query } = graph;

export const player1Query = query((state) => state.player1);
export const player2Query = query((state) => state.player2);
export const isLoadingQuery = query(
  (state) => state.player1.isLoading,
  (state) => state.player2.isLoading,
  ([p1IsLoading, p2IsLoading]) => p1IsLoading || p2IsLoading
);

export const cardStoreResolver = (): InjectionDef<CardStore> =>
  asScoped(cardStoreToken, cardStoreFactory);

function draw(this: { state: ReactiveModel<CardState> }): void {
  this.state.set(
    query((state) => state),
    (state) => ({
      player1: {
        ...state.player1,
        isLoading: true,
        card: null,
        win: false,
      },
      player2: {
        ...state.player2,
        isLoading: true,
        card: null,
        win: false,
      },
    })
  );
}

function drawSuccess(
  this: { state: ReactiveModel<CardState> },
  [card1, card2]: [Card, Card],
  winner: number
): void {
  this.state.set(
    query((state) => state),
    (state) => {
      const isCard1Winner = [0, 1].includes(winner);
      const isCard2Winner = [0, -1].includes(winner);
      const _state = (player: CardPlayer, card: Card, isWinner: boolean) => ({
        ...player,
        card,
        win: isWinner,
        isLoading: false,
        score: player.score + (isWinner ? 1 : 0),
      });

      return {
        player1: {
          ..._state(state.player1, card1, isCard1Winner),
        },
        player2: {
          ..._state(state.player2, card2, isCard2Winner),
        },
      };
    }
  );
}

function drawFailure(this: { state: ReactiveModel<CardState> }): void {
  this.state.set(
    query((state) => state),
    (state) => ({
      player1: {
        ...state.player1,
        isLoading: false,
        card: null,
        win: false,
      },
      player2: {
        ...state.player2,
        isLoading: false,
        card: null,
        win: false,
      },
    })
  );
}

function destroy(this: { state: ReactiveModel<CardState> }): void {
  this.state.destroy();
}

export function cardStoreFactory() {
  // co gdyby metodki budować ze fragmentów? głównie chodzi o to,
  // żeby przekazać context i żeby metodki miały dostęp do state
  // const store = build(
  //   storeBuilder(state),
  //   props((store) => ({
  //     player1: store.select((state) => state.player1),
  //     player2: store.select((state) => state.player2),
  //     isLoading: store.select(
  //       (state) => state.player1.isLoading && state.player2.isLoading
  //     ),
  //     draw: () => store.update(draw()),
  //     drawSuccess: (cards: [Card, Card], winner: number) =>
  //       store.update(drawSuccess(cards, winner)),
  //     drawFailure: () => store.update(drawFailure()),
  //   }))
  // );

  const model = createReactiveModel(initialState);

  return {
    state: model,
    graph,
    draw,
    drawSuccess,
    drawFailure,
    destroy,
  };
}

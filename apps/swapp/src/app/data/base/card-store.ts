import {
  createReactiveModel,
  createGraph,
  ReactiveModel,
  TOKEN,
  LIFETIME,
  Lifetime,
  FACTORY,
  Token,
  $,
  computed,
} from '@web-fragments/core';
import { CardPlayer } from './models/card-player';
import { Card } from './models/card';

interface CardState {
  player1: CardPlayer;
  player2: CardPlayer;
}

const initialState: CardState = {
  player1: { score: 0, isLoading: false, win: false },
  player2: { score: 0, isLoading: false, win: false },
};

// const PLAYER_1 = Symbol('');
// const PLAYER_2 = Symbol('');
// const IS_LOADING = Symbol('');

// const model = {
//   player1: {
//     [WATCH]: PLAYER_1,
//     [VALUE]: {
//       score: 0,
//       isLoading: { [WATCH]: IS_LOADING, [VALUE]: false },
//       win: false,
//     },
//   },
//   player2: {
//     [WATCH]: PLAYER_2,
//     [VALUE]: {
//       score: 0,
//       isLoading: { [WATCH]: IS_LOADING, [VALUE]: false },
//       win: false,
//     },
//   },
// };

const min = (options: any) => (value: any, state: any) => {
  console.log('min validator');
};
const max = (options: any) => (value: any, state: any) => {
  console.log('max validator', { value, state });
};

export const cardModel = {
  player1: $({
    score: 0,
    isLoading: $(false),
    win: false,
  }),
  player2: $({
    score: 0,
    isLoading: $(false),
    win: false,
  }),
};

// export const cardModel = {
//   player1: $({
//     score: $(0, [min(0), max(10)]),
//     isLoading: $(false),
//     win: false,
//   }),
//   player2: $({
//     score: 0,
//     isLoading: $(false),
//     win: false,
//   }),
// };

// const newModel = createReactiveModel(cardModel);

// signals = source({ [MODEL]: model2 }).getSignals({
//   isLoading: (signals, state) =>
//     signals.player1.isLoading() || signals.player2.isLoading(),
// });

const graph = createGraph(initialState);
const { query } = graph;

// export const player1Query = query((state) => state.player1);
// export const player2Query = query((state) => state.player2);
// export const isLoadingQuery = query(
//   (state) => state.player1.isLoading,
//   (state) => state.player2.isLoading,
//   ([p1IsLoading, p2IsLoading]) => p1IsLoading || p2IsLoading
// );

function draw(this: { signals: { player1: any; player2: any } }): void {
  this.signals.player1.$value = {
    ...this.signals.player1.$value,
    isLoading: true,
    card: null,
    win: false,
  };

  this.signals.player2.$value = {
    ...this.signals.player2.$value,
    isLoading: true,
    card: null,
    win: false,
  };
}

function drawSuccess(
  this: { signals: { player1: any; player2: any } },
  [card1, card2]: [Card, Card],
  winner: number
): void {
  const isCard1Winner = [0, 1].includes(winner);
  const isCard2Winner = [0, -1].includes(winner);
  const _state = (player: CardPlayer, card: Card, isWinner: boolean) => ({
    ...player,
    card,
    win: isWinner,
    isLoading: false,
    score: player.score + (isWinner ? 1 : 0),
  });

  this.signals.player1.$value = {
    ..._state(this.signals.player1.$value, card1, isCard1Winner),
  };

  this.signals.player2.$value = {
    ..._state(this.signals.player2.$value, card2, isCard2Winner),
  };
}

function drawFailure(this: { signals: { player1: any; player2: any } }): void {
  this.signals.player1.$value = {
    ...this.signals.player1.$value,
    isLoading: false,
    card: null,
    win: false,
  };

  this.signals.player2.$value = {
    ...this.signals.player2.$value,
    isLoading: false,
    card: null,
    win: false,
  };
}

function destroy(this: { state: ReactiveModel<CardState> }): void {
  this.state.destroy();
}

export function cardStoreFactory() {
  const model: ReactiveModel<CardState> = createReactiveModel(
    cardModel
  ) as unknown as ReactiveModel<CardState>;
  // potrzebne nazwy dla signali, unikalne, czyli najlepiej z path
  // isLoading - ogarnąć computed
  const isLoading = computed(
    model,
    model.signals.player1.isLoading,
    model.signals.player2.isLoading,
    ([p1IsLoading, p2IsLoading]) => p1IsLoading || p2IsLoading
  );

  // dodawanie wielu callbacks
  // dobieranie się do signals jak do normalnego obiektu, a nie nazwa typu player1.isLoading, bo to potem może być nieczytelne,
  // no i też potem w formularzach chyba będzie gorzej się dobierać do wartości
  // przy testach formularza dodać np. zależność, że zmiana jednej wartości wymusza zmianę innej (np. odblokowywanie dropdownów)

  return {
    draw,
    drawSuccess,
    drawFailure,
    destroy,
    signals: {
      isLoading: isLoading,
      player1: model.signals.player1,
      player2: model.signals.player2,
    },
  };
}

export type CardStore = ReturnType<typeof cardStoreFactory>;
export const CARD_STORE: Token<CardStore> = Symbol('CARD_STORE');

export const cardStore = {
  [TOKEN]: CARD_STORE,
  [LIFETIME]: Lifetime.scoped,
  [FACTORY]: cardStoreFactory,
};

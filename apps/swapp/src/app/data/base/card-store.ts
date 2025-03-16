import {
  createReactiveModel,
  ReactiveModel,
  TOKEN,
  LIFETIME,
  Lifetime,
  FACTORY,
  Token,
  computed,
} from '@web-fragments/core';
import { CardPlayer } from './models/card-player';
import { Card } from './models/card';

interface CardState {
  player1: CardPlayer;
  player2: CardPlayer;
}

// type CardStoreSignals = {
//   isLoading: boolean;
//   player1:
// };

export const cardModel = {
  player1: {
    score: 0,
    isLoading: false,
    win: false,
  },
  player2: {
    score: 0,
    isLoading: false,
    win: false,
  },
};

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

// const authModel = $({
//   isAuth: $(_<boolean>(), { validators: [], disabled: true }),
//   authUser: $(_<{ name: string }>()),
//   userContext: $(_<{ id: number }>()),
//   session: $(_(), {
//     graph: {
//       user: $object({
//         id: $field<number>({ readonly: true }),
//       }),
//     },
//     validators: [],
//   }),
//   isSigningIn: $(false),
//   isLoadingUserContext: $(false),
//   isLoginLinkSent: $(false),
//   version: 1,
//   details: { title: 'title ' },
// });

function cardStoreFactory() {
  // const model2 = createModel(cardModel);
  // const authModel2 = createModel(authModel);
  const model = createReactiveModel(cardModel);
  const player1 = model.getRef((schema) => schema.player1);
  const player2 = model.getRef((schema) => schema.player2);
  // const formModel = model.toSignals();
  console.log(player1.$value);
  console.log(player2.$value);

  // model.player1.$value;

  const isLoading = computed(
    model.getRef((schema) => schema.player1.isLoading),
    model.getRef((schema) => schema.player2.isLoading),
    ([p1IsLoading, p2IsLoading]) => p1IsLoading || p2IsLoading
  );

  // dodawanie wielu callbacks
  // przy testach formularza dodać np. zależność, że zmiana jednej wartości wymusza zmianę innej (np. odblokowywanie dropdownów)

  return {
    draw,
    drawSuccess,
    drawFailure,
    destroy,
    signals: {
      isLoading,
      player1,
      player2,
    },
  };
}

export type CardStore = ReturnType<typeof cardStoreFactory>;
export const CARD_STORE = Token<CardStore>('CARD_STORE');

export const cardStore = {
  [TOKEN]: CARD_STORE,
  [LIFETIME]: Lifetime.scoped,
  [FACTORY]: cardStoreFactory,
};

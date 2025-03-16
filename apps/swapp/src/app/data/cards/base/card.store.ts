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

function draw(this: { refs: { player1: any; player2: any } }): void {
  this.refs.player1.$value = {
    ...this.refs.player1.$value,
    isLoading: true,
    card: null,
    win: false,
  };

  this.refs.player2.$value = {
    ...this.refs.player2.$value,
    isLoading: true,
    card: null,
    win: false,
  };
}

function drawSuccess(
  this: { refs: { player1: any; player2: any } },
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

  this.refs.player1.$value = {
    ..._state(this.refs.player1.$value, card1, isCard1Winner),
  };

  this.refs.player2.$value = {
    ..._state(this.refs.player2.$value, card2, isCard2Winner),
  };
}

function drawFailure(this: { refs: { player1: any; player2: any } }): void {
  this.refs.player1.$value = {
    ...this.refs.player1.$value,
    isLoading: false,
    card: null,
    win: false,
  };

  this.refs.player2.$value = {
    ...this.refs.player2.$value,
    isLoading: false,
    card: null,
    win: false,
  };
}

function destroy(this: { state: ReactiveModel<CardState> }): void {
  this.state.destroy();
}

function cardStoreFactory() {
  const model = createReactiveModel({
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
  });
  const player1 = model.getRef((schema) => schema.player1);
  const player2 = model.getRef((schema) => schema.player2);

  const isLoading = computed(
    model.getRef((schema) => schema.player1.isLoading),
    model.getRef((schema) => schema.player2.isLoading),
    ([p1IsLoading, p2IsLoading]) => p1IsLoading || p2IsLoading
  );

  return {
    draw,
    drawSuccess,
    drawFailure,
    destroy,
    refs: {
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

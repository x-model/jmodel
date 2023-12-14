import { DestroyRef } from '@angular/core';
import {
  Method,
  build,
  props,
  signalState,
  storeBuilder,
  storeFragment,
} from '@web-fragments/ng-fragments';
import { CardPlayer } from './models/card-player';
import { Card } from './models/card';

interface CardState {
  [key: string]: unknown;
  player1: CardPlayer;
  player2: CardPlayer;
}

const initialState: CardState = {
  player1: { score: 0, isLoading: false, win: false },
  player2: { score: 0, isLoading: false, win: false },
};

export function draw(): Method<CardState> {
  const _state = (player: CardPlayer) => ({
    ...player,
    isLoading: true,
    card: null,
    win: false,
  });

  return (state) => ({
    player1: {
      ..._state(state.player1),
    },
    player2: {
      ..._state(state.player2),
    },
  });
}

export function drawSuccess(
  [card1, card2]: [Card, Card],
  winner: number
): Method<CardState> {
  const isCard1Winner = [0, 1].includes(winner);
  const isCard2Winner = [0, -1].includes(winner);
  const _state = (player: CardPlayer, card: Card, isWinner: boolean) => ({
    ...player,
    card,
    win: isWinner,
    isLoading: false,
    score: player.score + (isWinner ? 1 : 0),
  });

  return (state: CardState) => ({
    player1: {
      ..._state(state.player1, card1, isCard1Winner),
    },
    player2: {
      ..._state(state.player2, card2, isCard2Winner),
    },
  });
}

export function drawFailure(): Method<CardState> {
  const _state = (player: CardPlayer) => ({
    ...player,
    isLoading: false,
    card: null,
    win: false,
  });

  return (state) => ({
    player1: {
      ..._state(state.player1),
    },
    player2: {
      ..._state(state.player2),
    },
  });
}

export const store$ = storeFragment(({ _inject }) => {
  _inject(DestroyRef).onDestroy(() => {
    console.log('store destroyed');
  });

  // const state = ;
  // const { update, select } = state;

  // co gdyby metodki budować ze fragmentów? głównie chodzi o to,
  // żeby przekazać context i żeby metodki miały dostęp do state
  const store = build(
    storeBuilder(signalState(initialState)),
    props(({ select, update }) => ({
      player1: select((state) => state.player1),
      player2: select((state) => state.player2),
      isLoading: select(
        (state) => state.player1.isLoading && state.player2.isLoading
      ),
      draw: () => update(draw()),
      drawSuccess: (cards: [Card, Card], winner: number) =>
        update(drawSuccess(cards, winner)),
      drawFailure: () => update(drawFailure()),
    }))
  );

  console.log('store initialized');

  return store;
});

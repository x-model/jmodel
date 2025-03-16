import { Context } from '@web-fragments/core';
import { draw } from './card.service';
import { CARD_STORE } from './card.store';

export const cardSourceFactory = ({ inject }: Context) => ({
  draw,
  refs: inject(CARD_STORE).refs,
});

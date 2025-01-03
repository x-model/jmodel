import { Context } from '@web-fragments/core';
import { getRandom } from '../../common';
import { Card } from './models/card';
import { CARD_STORE } from './card-store';
import { CARD_COMPARE, CARD_MAP, CARD_REPOSITORY } from './di-tokens';

// Czy to powinno być w modelu czy w repository?
// W sumie to już jest jakaś logika, to już jest obróbka danych z data sources
// w repositories też by to mogło być tylko zrobiliśmy repository jako singleton
// repository powinno się traktować jak dawne api serwisy?
async function totalPages(this: Context): Promise<number> {
  const { data, error } = await this.inject(CARD_REPOSITORY).getAll({
    page: 1,
    limit: 1,
  });
  return error ? 0 : data?.totalPages;
}

async function getCard(this: Context): Promise<Card> {
  // const totalPages = this.inject(CARD_MEMO).totalPages;
  const repository = this.inject(CARD_REPOSITORY);
  const map = this.inject(CARD_MAP);

  const total = await this.execute(totalPages);
  const { data: resourceResult } = await repository.getAll({
    page: getRandomPage(total),
    limit: 1,
  });

  const itemId = resourceResult?.items?.[0]?.uid;

  if (itemId && !isNaN(+itemId)) {
    const { data: resourceItemResult } = await repository.get(+itemId);
    return map(resourceItemResult);
  } else {
    return null;
  }
}

export async function draw(this: Context): Promise<void> {
  const store = this.inject(CARD_STORE);
  const compare = this.inject(CARD_COMPARE);
  store.draw();
  // store.update(draw);

  const [card1, card2] = await Promise.all([
    this.execute(getCard),
    this.execute(getCard),
  ]);

  if (card1 && card2) {
    const winner = compare([card1, card2]);
    store.drawSuccess([card1, card2], winner);
  } else {
    store.drawFailure();
  }
}

const getRandomPage = (range: number): number => {
  return getRandom(1, range);
};

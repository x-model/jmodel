import { Card } from './card';

export type CardPlayer = {
  name?: string;
  score: number;
  win: boolean;
  card?: Card;
  isLoading: boolean;
};

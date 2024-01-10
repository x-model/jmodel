import { baseGet, baseGetAll } from '../base/base-data-source';
import { StarshipDetailResult } from './starship-detail-result';

export const starshipGetAll = () => baseGetAll('starships');
export const starshipGet = () => baseGet<StarshipDetailResult>('starships');

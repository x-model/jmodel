import { baseGet, baseGetAll } from '../base/fragments/base-api';
import { StarshipDetailResult } from './models/starship-detail-result';

export const starshipGetAll = baseGetAll('starships');
export const starshipGet = baseGet<StarshipDetailResult>('starships');

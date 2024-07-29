import { ApiResult, Context } from '@web-fragments/core';
import { get, getAll } from '../base/base-data-source';
import { CollectionParams } from '../base/models/collection-params';
import { StarshipDetailResult } from './starship-detail-result';
import { CollectionResult } from '../base/models/collection-result';

export const resource = 'starships';

export function starshipGetAll(
  this: Context,
  params: CollectionParams
): Promise<ApiResult<CollectionResult>> {
  return getAll(this, resource, params);
}

export function starshipGet(
  this: Context,
  id: number
): Promise<ApiResult<StarshipDetailResult>> {
  return get(this, resource, id);
}

// export const starshipGet = {
//   [ACTION]: get<StarshipDetailResult>,
//   [CONTEXT]: { resource },
// };

// export function starshipGet(this: StarshipContext, id: number) {
//   return this.get<StarshipDetailResult>;
// }

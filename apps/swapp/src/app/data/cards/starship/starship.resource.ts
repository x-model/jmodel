import { ApiResult, Context } from '@x-model/jmodel';
import { StarshipDetailResult } from './models/api/starship-detail-api-model';
import { CollectionParams } from '../../common/resources/models/collection-params';
import { CollectionResult } from '../../common/resources/models/collection-result';
import { get, getAll } from '../../common/resources/base.resource';

export const resource = 'starships';

export function starshipGetAll(
  this: Context,
  params: CollectionParams
): Promise<ApiResult<CollectionResult>> {
  return this.execute(getAll, resource, params);
}

export function starshipGet(
  this: Context,
  id: number
): Promise<ApiResult<StarshipDetailResult>> {
  return this.execute(get<StarshipDetailResult>, resource, id);
}

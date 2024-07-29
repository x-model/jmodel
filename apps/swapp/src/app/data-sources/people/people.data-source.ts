import { ApiResult, Context } from '@web-fragments/core';
import { get, getAll } from '../base/base-data-source';
import { CollectionParams } from '../base/models/collection-params';
import { PeopleDetailResult } from './people-detail-result';
import { CollectionResult } from '../base/models/collection-result';

export const resource = 'people';

export const baseUrl = 'https://www.swapi.tech/api';

// export const peopleGetAll = () => baseGetAll('people');
// export const peopleGet = () => baseGet<PeopleDetailResult>('people');

export function peopleGetAll(
  this: Context,
  params: CollectionParams
): Promise<ApiResult<CollectionResult>> {
  return getAll(this, resource, params);
}

export function peopleGet(
  this: Context,
  id: number
): Promise<ApiResult<PeopleDetailResult>> {
  return get(this, resource, id);
}

import { ApiResult, Context } from '@web-fragments/core';
import { PeopleDetailResult } from './models/api/people-detail.api-model';
import { CollectionParams } from '../../common/resources/models/collection-params';
import { CollectionResult } from '../../common/resources/models/collection-result';
import { get, getAll } from '../../common/resources/base.resource';

export const resource = 'people';

export function peopleGetAll(
  this: Context,
  params: CollectionParams
): Promise<ApiResult<CollectionResult>> {
  return this.execute(getAll, resource, params);
}

export function peopleGet(
  this: Context,
  id: number
): Promise<ApiResult<PeopleDetailResult>> {
  return this.execute(get<PeopleDetailResult>, resource, id);
}

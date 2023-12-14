import { Observable, map } from 'rxjs';
import { ApiResult, apiFragment } from '@web-fragments/ng-fragments';
import { mapResponseToCamelCase } from '../utils/response.util';
import { CollectionApiResult } from '../models/collection-api-result';
import { CollectionResult } from '../models/collection-result';
import { DetailApiResult } from '../models/detail-api-result';
import { CollectionParams } from '../models/collection-params';
import { getCollectionParams } from '../utils/params.util';

export const baseUrl = 'https://www.swapi.tech/api';

export const baseGetAll = (resource: string) =>
  apiFragment<CollectionParams, Promise<ApiResult<CollectionResult>>>(
    ({ _client, _send, _input: params }) => {
      const request = _client
        .get(`${baseUrl}/${resource}`, {
          params: getCollectionParams(params),
        })
        .pipe(map((result) => adaptToCollectionResult(result)));

      return _send(request);
    }
  );

export const baseGet = <T>(resource: string) =>
  apiFragment<number, Promise<ApiResult<T>>>(
    ({ _input: id, _client, _send }) => {
      const request: Observable<T> = _client
        .get(`${baseUrl}/${resource}/${id}`)
        .pipe(map((result) => adaptToDetailResult(result)));

      return _send(request);
    }
  );

const adaptToDetailResult = <T extends object, R>(model: T): R | null => {
  if (!model) {
    return null;
  }

  const mappedResponse = mapResponseToCamelCase<
    T,
    DetailApiResult<Omit<R, 'id'>>
  >(model);

  return (
    mappedResponse?.result &&
    ({
      id: mappedResponse.result.uid,
      ...mappedResponse.result.properties,
    } as R)
  );
};

const adaptToCollectionResult = <T extends object, R extends CollectionResult>(
  model: T
): R | null => {
  if (!model) {
    return null;
  }

  const mappedResponse = mapResponseToCamelCase<T, CollectionApiResult>(model);

  return {
    totalItems: mappedResponse?.totalRecords || 0,
    totalPages: mappedResponse?.totalPages || 0,
    items: mappedResponse?.results || [],
  } as R;
};

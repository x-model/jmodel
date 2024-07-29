import { mapResponseToCamelCase } from '../../data/base/utils/response.util';
import { CollectionApiResult } from './models/collection-api-result';
import { CollectionResult } from './models/collection-result';
import { DetailApiResult } from './models/detail-api-result';
import { CollectionParams } from './models/collection-params';
import { getCollectionParams } from '../../data/base/utils/params.util';
import { ApiResult, Context } from '@web-fragments/core';
import { httpClient } from './http-client/http-client';

export const baseUrl = 'https://www.swapi.tech/api';

export async function getAll(
  context: Context,
  resource: string,
  params: CollectionParams
): Promise<ApiResult<CollectionResult>> {
  const client = context.inject(httpClient as any);

  try {
    const response = await client(
      `${baseUrl}/${resource}?${getCollectionParams(params)}`
    );
    const result = await response.json();
    return { data: adaptToCollectionResult(result), error: null };
  } catch (error) {
    return Promise.resolve({ data: null, error });
  }
}

// export function get<T>(resource: string) {
//   return async function (this: ApiContext, id: number): Promise<ApiResult<T>> {
//     const { resource } = this.params[get];

//     try {
//       const response = await this.client(`${baseUrl}/${resource}/${id}`);
//       const result = await response.json();
//       return { data: adaptToDetailResult(result), error: null };
//     } catch (error) {
//       return Promise.resolve({ data: null, error });
//     }
//   };
// }

export async function get<T>(
  context: Context,
  resource: string,
  id: number
): Promise<ApiResult<T>> {
  // const { resource } = this.params['resource'];
  // const resource = this.contextFor(get);
  // const { resource } = this.context.get('resource');
  const client = context.inject(httpClient as any);

  try {
    const response = await client(`${baseUrl}/${resource}/${id}`);
    const result = await response.json();
    return { data: adaptToDetailResult(result), error: null };
  } catch (error) {
    return Promise.resolve({ data: null, error });
  }
}

export const adaptToDetailResult = <T extends object, R>(
  model: T
): R | null => {
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

export const adaptToCollectionResult = <
  T extends object,
  R extends CollectionResult
>(
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

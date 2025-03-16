import { ApiResult, Context } from '@x-model/jmodel';
import { CollectionApiResult } from './models/collection-api-result';
import { CollectionResult } from './models/collection-result';
import { DetailApiResult } from './models/detail-api-result';
import { CollectionParams } from './models/collection-params';
import { httpClient } from './http-client/http-client';
import { getCollectionParams } from './utils/params.util';
import { mapResponseToCamelCase } from './utils/response.util';

export const baseUrl = 'https://www.swapi.tech/api';

export async function getAll(
  this: Context,
  resource: string,
  params: CollectionParams
): Promise<ApiResult<CollectionResult>> {
  const client = this.inject(httpClient as any);

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

export async function get<T>(
  this: Context,
  resource: string,
  id: number
): Promise<ApiResult<T>> {
  const client = this.inject(httpClient as any);

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

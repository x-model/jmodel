import { mapResponseToCamelCase } from '../utils/response.util';
import { CollectionApiResult } from '../models/collection-api-result';
import { CollectionResult } from '../models/collection-result';
import { DetailApiResult } from '../models/detail-api-result';
import { CollectionParams } from '../models/collection-params';
import { getCollectionParams } from '../utils/params.util';
import { ExecutionContext, fragment, ApiResult } from '@web-fragments/core';

export type ApiContext = { client: typeof fetch } & ExecutionContext;
export type Input<T> = { _input: T };

export const baseUrl = 'https://www.swapi.tech/api';

export const baseGetAll = (resource: string) =>
  fragment(
    async ({
      client,
      _input: params,
    }: ApiContext & Input<CollectionParams>) => {
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
  );

export const baseGet = <T>(resource: string) =>
  fragment<number, Promise<ApiResult<T>>>(
    async ({ client, _input: id }: ApiContext & Input<number>) => {
      try {
        const response = await client(`${baseUrl}/${resource}/${id}`);
        const result = await response.json();
        return { data: adaptToDetailResult(result), error: null };
      } catch (error) {
        return Promise.resolve({ data: null, error });
      }
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

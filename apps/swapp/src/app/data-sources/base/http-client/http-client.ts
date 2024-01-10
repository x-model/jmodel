import {
  injectionToken,
  asSingleton,
  ExecutionContext,
} from '@web-fragments/core';

export const httpClientToken = injectionToken<typeof fetch>('httpClient');

export const httpClientResolver = () =>
  asSingleton<typeof fetch>(httpClientToken, () => fetch);

export type ApiContext = { client: typeof fetch } & ExecutionContext;
export type Input<T> = { _input: T };

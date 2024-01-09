import { injectionToken, asSingleton } from '@web-fragments/core';

export const httpClientToken = injectionToken<typeof fetch>('httpClient');

export const httpClientResolver = () =>
  asSingleton<typeof fetch>(httpClientToken, () => fetch);

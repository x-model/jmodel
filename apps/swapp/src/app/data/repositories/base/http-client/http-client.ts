import { injectionToken, singleton } from '@web-fragments/core';

export const httpClientToken = injectionToken<typeof fetch>('httpClient');

export const resolveHttpClient = () =>
  singleton<typeof fetch>(httpClientToken, () => fetch);

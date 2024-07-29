import { Token, TOKEN, Lifetime, LIFETIME, FACTORY } from '@web-fragments/core';

export const HTTP_CLIENT: Token<typeof fetch> = Symbol('HTTP_CLIENT');

export const httpClient = {
  [TOKEN]: HTTP_CLIENT,
  [LIFETIME]: Lifetime.singleton,
  [FACTORY]: () => (url) => fetch(url),
};

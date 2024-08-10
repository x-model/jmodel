import { Token, TOKEN, Lifetime, LIFETIME, FACTORY } from '@web-fragments/core';

export const HTTP_CLIENT: Token<typeof fetch> = Symbol('HTTP_CLIENT');

export const httpClient = {
  [TOKEN]: HTTP_CLIENT,
  [LIFETIME]: Lifetime.singleton,
  [FACTORY]: () => (url) => fetch(url),
};

export async function sendRequest<T>(request: Promise<T>) {
  try {
    const result = await request;
    return { data: result, error: null };
  } catch (error) {
    return Promise.resolve({ data: null, error });
  }
}

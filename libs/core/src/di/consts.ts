import { Context } from '../builder/types';
import { InjectionToken } from './types';

export const INJECTABLE = Symbol('INJECTABLE');
export const TOKEN = Symbol('TOKEN');
export const LIFETIME = Symbol('LIFETIME');
export const FACTORY = Symbol('FACTORY');
export const PROVIDERS = Symbol('PROVIDERS');

export type ApiError = {
  message: string;
};

export type ApiResult<T> = {
  data: T;
  error: ApiError;
};

export type FactoryResult<T extends (context: Context) => unknown> =
  ReturnType<T> & Context;

export type Token<T> = Partial<{ _: T }> & symbol;

export const Token: <T>(name: string) => Token<T> = Symbol;

export function injectionToken<T>(description: string): InjectionToken<T> {
  return { token: Symbol(description) };
}

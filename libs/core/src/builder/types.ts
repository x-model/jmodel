import { Token } from '../di/consts';
import { Injector, Scope } from '../di/types';

export type CreationContext = {
  _contextId: symbol;
  _injector: Injector;
  _scope: Scope;
} & Context;

export type InjectFn = <T extends Token<unknown>>(value: T) => T['_'];
export type ExecuteFn = <T extends (...params: any[]) => unknown>(
  fn: T,
  ...params
) => ReturnType<T>;

export type Context = {
  inject: InjectFn;
  execute: ExecuteFn;
};

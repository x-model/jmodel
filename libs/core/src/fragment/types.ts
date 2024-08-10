import { Token } from '../di/consts';
import { Injector, ProviderToken, Scope } from '../di/types';

export type Fragments = Record<string, Fragment<unknown, unknown>>;

export type InjectFn = <T extends Token<unknown>>(value: T) => T['_'];
export type ExecuteFn = <T extends (...params: any[]) => unknown>(
  fn: T,
  ...params
) => ReturnType<T>;

export type ExecutionContext = {
  _exec: <TFragmentIn, TFragmentOut>(
    fragmentOrFactory: // | FragmentFactory<TFragmentIn, TFragmentOut>
    Fragment<TFragmentIn, TFragmentOut>,
    input?: TFragmentIn
  ) => TFragmentOut;
  _inject: <T>(token: ProviderToken<T>) => T;
};

export type Context = {
  inject: InjectFn;
  execute: ExecuteFn;
};

export type CreationContext = {
  _contextId: symbol;
  _injector: Injector;
  _scope: Scope;
} & Context;

export type FragmentContext<T> = T extends {
  new (): infer R;
}
  ? R
  : never;

export type FragmentOptions = Record<string, unknown>;

export type FragmentError = {
  message: string;
};

export type FragmentFactory<TFragmentIn, TFragmentOut> = (
  creationContext?: FragmentCreationContext
) => Fragment<TFragmentIn, TFragmentOut>;

export type FragmentFunctionContext<TFragmentIn> = {
  _input?: TFragmentIn;
  _exec: <TFragmentIn, TFragmentOut>(
    fragment: Fragment<TFragmentIn, TFragmentOut>,
    input?: TFragmentIn
  ) => TFragmentOut;
  _inject: <T>(token: ProviderToken<T>) => T;
};

export type TemplateResolveResult<TFragmentIn, TFragmentOut> = (
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut>,
  creationContext: FragmentCreationContext
) => Fragment<TFragmentIn, TFragmentOut>;

export type TemplateResolveFn<TFragmentIn, TFragmentOut> = (
  config: FragmentTemplateConfig
) => TemplateResolveResult<TFragmentIn, TFragmentOut>;

export type FragmentTemplate<TFragmentIn, TFragmentOut> = {
  id: symbol;
  static: 'root' | 'context';
  name: string;
  resolve: TemplateResolveFn<TFragmentIn, TFragmentOut>;
};

export type FragmentCreationContext = {
  contextId: symbol;
  injector: Injector;
};

export type TemplateCreationContext = {
  contextId: symbol;
  injector: Injector;
};

export type FragmentTemplateConfig = {
  creationContext?: TemplateCreationContext;
  options?: FragmentOptions;
};

export type FragmentFn<
  TFragmentIn,
  TFragmentOut,
  TFragmentFunctionContext = FragmentFunctionContext<TFragmentIn>
> = (context: TFragmentFunctionContext) => TFragmentOut;

export type Fragment<TFragmentIn, TFragmentOut> = (
  context: FragmentFunctionContext<TFragmentIn>
) => TFragmentOut;

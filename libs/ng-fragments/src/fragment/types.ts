import { Injector, ProviderToken } from '../di/types';
import { TemplateResolver } from './template-registry';

export type Fragments = Record<string, Fragment<unknown, unknown>>;

export type ScopeOptions = {
  rootInjector: Injector;
  localInjector: Injector;
  onRelease: (callback: () => void) => void;
};

export type Scope = {
  id: symbol;
  rootInjector: Injector;
  localInjector: Injector;
  onRelease: (callback: () => void) => () => void;
};

export type ExecutionContext = {
  _exec: <TFragmentIn, TFragmentOut>(
    fragmentOrFactory:
      | FragmentFactory<TFragmentIn, TFragmentOut>
      | Fragment<TFragmentIn, TFragmentOut>,
    input?: TFragmentIn
  ) => TFragmentOut;
  _inject: <T>(token: ProviderToken<T>) => T;
};

export type CreationContext = {
  _contextId: symbol;
  _injector: Injector;
  _templateRegistry: TemplateResolver;
  _scope: Scope;
} & ExecutionContext;

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
  creationContext: FragmentCreationContext,
  templateRegistry: TemplateResolver
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

export type Fragment<TFragmentIn, TFragmentOut> = {
  creationContext: FragmentCreationContext;
  execute(context: FragmentFunctionContext<TFragmentIn>): TFragmentOut;
};

export type FragmentType<T> = T extends FragmentFactory<infer In, infer Out>
  ? Fragment<In, Out>
  : never;

export type FragmentResultType<T> = T extends Fragment<unknown, infer TOut>
  ? TOut
  : T extends FragmentFactory<unknown, infer TOut>
  ? TOut
  : never;

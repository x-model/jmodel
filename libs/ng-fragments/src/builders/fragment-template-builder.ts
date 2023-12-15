import {
  FragmentTemplateConfig,
  FragmentTemplate,
  FragmentFunctionContext,
  TemplateCreationContext,
} from '../fragment/types';
import { Builder, BuilderPartialContext } from '../builder/types';
import { Factory, Unwrap } from '../types';
import { ProviderToken } from '../di/types';

type TemplateConfig = {
  name: string;
};

type StaticTemplateConfig = {
  static: 'root' | 'context';
  templateId: symbol;
} & TemplateConfig;

export type FragmentTemplateContext = {
  creationContext: TemplateCreationContext;
  _inject: <T>(token: ProviderToken<T>) => T;
};

export type ExecuteFn = <
  Context extends FragmentTemplateContext & BuilderPartialContext
>(
  context: Context & {
    executionContext: FragmentFunctionContext<unknown>;
    fragmentFn: (
      context: FragmentFunctionContext<unknown>
    ) => unknown | Promise<unknown>;
  }
) => unknown | Promise<unknown>;

export type BuilderConfig = StaticTemplateConfig | TemplateConfig;

export function fragmentTemplateBuilder<TFragmentIn, TFragmentOut>(
  builderConfig?: BuilderConfig
): Builder<
  FragmentTemplateContext,
  FragmentTemplate<TFragmentIn, TFragmentOut>
> {
  return function <
    FactoryResult extends FragmentTemplateContext & { execFn?: ExecuteFn }
  >(
    factory: Factory<FragmentTemplateContext, FactoryResult>
  ): FragmentTemplate<TFragmentIn, TFragmentOut> {
    const resolveFn = function (config: FragmentTemplateConfig) {
      const _creationContext = { ...config.creationContext };
      const _inject = <T>(token: ProviderToken<T>): T => {
        return _creationContext.injector.get(token);
      };

      const initialContext = {
        creationContext: undefined,
        _inject,
      };

      const _config: FactoryResult = factory(initialContext);

      return (fragmentFn, creationContext) => ({
        execute: (
          context: FragmentFunctionContext<TFragmentIn>
        ): TFragmentOut =>
          !_config.execFn
            ? fragmentFn({
                ...context,
                ..._config,
              })
            : _config.execFn({
                executionContext: context,
                fragmentFn,
                // do we need this _config here? onExecute method has also access to context
                ..._config,
              }),
        creationContext,
      });
    };

    return {
      id: (builderConfig as StaticTemplateConfig)?.templateId,
      static: (builderConfig as StaticTemplateConfig)?.static,
      name: builderConfig.name,
      resolve: resolveFn,
    };
  };
}

export function onExecute<
  Input extends BuilderPartialContext,
  Output extends { execFn: ExecuteFn }
>(
  factory: (context: Input) => (
    innerContext: Input & {
      executionContext: FragmentFunctionContext<unknown>;
      fragmentFn: (
        context: FragmentFunctionContext<unknown>
      ) => unknown | Promise<unknown>;
    }
  ) => unknown | Promise<unknown>
): Factory<Input, Unwrap<Input & Output>> {
  return (context: Input) =>
    ({ ...context, execFn: factory(context) } as Input & Output);
}

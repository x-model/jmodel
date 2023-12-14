import {
  CreationContext,
  ExecutionContext,
  Fragment,
  FragmentFactory,
} from '../fragment/types';
import { Builder, BuilderPartialContext } from '../builder/types';
import { Factory } from '../types';
import { resolveFragment } from '../fragment/resolver';

export type ResolveFn<T> = (config: CreationContext) => T;

export type Model<T> = {
  name: string;
  resolve: ResolveFn<T>;
};

export type BuilderConfig = {
  name: string;
};

export function modelBuilder<Config extends BuilderPartialContext>(
  builderConfig?: BuilderConfig
): Builder<ExecutionContext, Model<Config>> {
  return function <FactoryResult>(
    factory: Factory<ExecutionContext, FactoryResult & Config>
  ): Model<FactoryResult & Config> {
    const resolveFn = function (config: CreationContext) {
      let _innerContext;

      const tmpConfig = { ...config };

      const _exec = function _exec<TFragmentIn, TFragmentOut>(
        fragmentOrFactory:
          | FragmentFactory<TFragmentIn, TFragmentOut>
          | Fragment<TFragmentIn, TFragmentOut>,
        input?: TFragmentIn
      ): TFragmentOut {
        let context = {};

        context = {
          ..._innerContext,
        };

        // if (!tmpConfig._created) {
        //   console.warn('Cannot use context during creation');
        // } else {
        //   context = {
        //     ...this._innerContext,
        //   };
        // }
        const fragmentInstance = resolveFragment(
          fragmentOrFactory,
          tmpConfig._templateRegistry,
          {
            contextId: tmpConfig._contextId,
            injector: tmpConfig._injector,
          }
        );

        if (!fragmentInstance) {
          throw new Error('Cannot resolve fragment');
        }

        // At this moment we can't execute registered fragment from different context directly,
        // instead in context we can create method and execute this fragment from different context using this method
        if (
          fragmentInstance.creationContext.contextId !== tmpConfig._contextId
        ) {
          throw new Error(
            'Cannot execute registered fragment from different context'
          );
        }

        // we don't have to run this from injectionContext, because developer should use context._inject method
        return fragmentInstance.execute({
          ...context,
          _exec,
          _inject: tmpConfig._inject,
          _input: input,
        });
      };

      // też w sumie w tym całym config powinien się tylko znajdować creationContext, nic więcej,
      // w modelu nie powinniśmy się dobierać do Context
      // w sumie to powinno to być chyba odwrotnie, to model powinien być parentem dla tego context

      const context = {
        ...tmpConfig,
        _exec: (fragment, input?) => _exec(fragment, input),
      } as any;

      const _config = factory(context) as any; // FactoryResult & CreationContext;

      _innerContext = getInnerContext<FactoryResult & CreationContext>(
        _config,
        context
      );

      return _innerContext;

      // const result = {};

      // for (const key in _innerContext) {
      //   Object.defineProperty(result, key, {
      //     value: _innerContext[key],
      //     writable: false,
      //   });
      // }

      // return result;
    };

    return {
      name: builderConfig.name,
      resolve: resolveFn,
    };
  };
}

function getInnerContext<
  Context extends BuilderPartialContext & CreationContext
>(
  context: Context,
  creationContext: CreationContext
): Exclude<Context, CreationContext> {
  const toExclude = Object.keys(creationContext);

  return Object.keys(context).reduce(
    (result, key) =>
      toExclude.includes(key) ? result : { ...result, [key]: context[key] },
    {}
  ) as Exclude<Context, CreationContext>;
}

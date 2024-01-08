import { Injector, inject, EnvironmentInjector } from '@angular/core';
import {
  Fragment,
  FragmentFactory,
  resolveFragment,
  Container,
  Type,
} from '@web-fragments/core';

export type ContentType<T> = T extends Type<infer TInner> ? TInner : T;

export type ContextType<T> = ContentType<T>;

export type BuilderConfig = {
  providedIn?: 'root';
  name?: string;
};

export class ExecutionContext {
  _injector = inject(Injector);
  _rootInjector = inject(EnvironmentInjector);
  _container = inject(Container);
  // Symbol(builderConfig?.name || 'CONTEXT_ID')
  // Ułatwi potem debugowanie
  _id = Symbol('CONTEXT_ID');
  /**
   * prevents to use context during creation process
   */
  _executionContext: Pick<ExecutionContext, '_exec'> = {
    _exec: (fragment, input?) => this._exec(fragment, input),
  };

  constructor() {}

  _exec<TFragmentIn, TFragmentOut>(
    fragmentOrFactory:
      | FragmentFactory<TFragmentIn, TFragmentOut>
      | Fragment<TFragmentIn, TFragmentOut>,
    input?: TFragmentIn
  ): TFragmentOut {
    let context = {};

    const fragmentInstance = resolveFragment(fragmentOrFactory, {
      contextId: this._id,
      injector: this._injector,
    });

    if (!fragmentInstance) {
      throw new Error('Cannot resolve fragment');
    }

    // At this moment we can't execute registered fragment from different context directly,
    // instead in context we can create method and execute this fragment from different context using this method
    if (fragmentInstance.creationContext.contextId !== this._id) {
      throw new Error(
        'Cannot execute registered fragment from different context'
      );
    }

    // we don't have to run this from injectionContext, because developer should use context._inject method
    return fragmentInstance.execute({
      ...this._executionContext,
      //   ...context, // w jaki sposób przekazywać context?
      _input: input,
    } as any);
  }
}

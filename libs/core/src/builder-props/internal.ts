import { Factory, Unwrap } from '../types';
import { BuilderPartialContext } from '../builder/types';

export function internalProps<Input, Output extends BuilderPartialContext>(
  value: Output
): Factory<Input, Unwrap<Input & { _inner: Output }>>;
export function internalProps<Input, Output extends BuilderPartialContext>(
  factory: (context: Input) => Output
): Factory<Input, Unwrap<Input & { _inner: Output }>>;

export function internalProps<Input, Output extends BuilderPartialContext>(
  valueOrFactory: Output | ((context: Input) => Output)
): Factory<Input, Unwrap<Input & { _inner: Output }>> {
  return (context: Input) => {
    const result =
      typeof valueOrFactory === 'function'
        ? valueOrFactory(context)
        : valueOrFactory;

    return { ...context, _inner: result };
  };
}

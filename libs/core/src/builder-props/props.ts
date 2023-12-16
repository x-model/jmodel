import { Factory, Unwrap } from '../types';
import { BuilderPartialContext } from '../builder/types';

export function props<
  Input extends BuilderPartialContext,
  Output extends BuilderPartialContext
>(value: Output): Factory<Input, Unwrap<Input & Output>>;
export function props<
  Input extends BuilderPartialContext,
  Output extends BuilderPartialContext
>(factory: (context: Input) => Output): Factory<Input, Unwrap<Input & Output>>;

export function props<
  Input extends BuilderPartialContext,
  Output extends BuilderPartialContext
>(
  valueOrFactory: Output | ((context: Input) => Output)
): Factory<Input, Unwrap<Input & Output>> {
  return (context: Input) => {
    const result =
      typeof valueOrFactory === 'function'
        ? valueOrFactory(context)
        : valueOrFactory;

    return { ...context, ...result };
  };
}

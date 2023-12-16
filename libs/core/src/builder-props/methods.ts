import { props } from './props';
import { BuilderPartialContext } from '../builder/types';
import { Factory, Method, Unwrap } from '../types';

export function methods<
  Input extends BuilderPartialContext,
  Output extends Record<string, Method<unknown>>
>(factory: Factory<Input, Output>): Factory<Input, Unwrap<Input & Output>> {
  return props(factory);
}

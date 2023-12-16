import { BuilderPartialContext } from '../builder/types';
import { Factory, Unwrap } from '../types';
import { props } from './props';

export type Hooks = {
  onInit?: () => void;
  onDestroy?: () => void;
};

export function hooks<Context extends BuilderPartialContext>(
  factory: Factory<Context, Unwrap<Hooks>>
): Factory<Context, Unwrap<Context & Unwrap<Hooks>>> {
  return props(factory);
}

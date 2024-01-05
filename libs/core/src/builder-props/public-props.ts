import { BuilderPartialContext } from '../builder/types';
import { Factory, PUBLIC, Unwrap } from '../types';

export function publicProps<
  Input extends BuilderPartialContext,
  Output extends BuilderPartialContext
>(
  factory: (context: Input) => Output
): Factory<Input, Unwrap<Input> & { [PUBLIC]: Output }> {
  return (context: Input) => {
    const result = factory(context);

    return { ...context, [PUBLIC]: result };
  };
}

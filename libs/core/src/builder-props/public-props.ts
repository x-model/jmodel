import { BuilderPartialContext } from '../builder/types';
import { Factory, INTERNAL, PUBLIC, Unwrap } from '../types';

export function publicProps<
  Input extends BuilderPartialContext,
  Output extends BuilderPartialContext
>(
  factory: (context: Input) => Output
): Factory<Input, { [INTERNAL]: Input; [PUBLIC]: Output }> {
  return (context: Input) => {
    const result = factory(context);

    return { [INTERNAL]: context, [PUBLIC]: result };
  };
}

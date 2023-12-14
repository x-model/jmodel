import { BuilderPartialContext } from '../builder/types';
import { Model } from '../builders/model-builder.old';
import { CreationContext } from '../fragment/types';
import { Factory, Unwrap } from '../types';

export function models<
  ModelFactories extends Record<string, Model<any>>,
  Input extends BuilderPartialContext,
  Output extends {
    [P in keyof ModelFactories]: ReturnType<ModelFactories[P]['resolve']>;
  }
>(modelFactories: ModelFactories): Factory<Input, Unwrap<Input & Output>> {
  return (context: Input & CreationContext) => {
    const modelInstances =
      modelFactories &&
      (Object.keys(modelFactories).reduce((instances, modelKey) => {
        const model = modelFactories[modelKey].resolve(context);
        // const modelResult =
        //   modelKey === 'default' ? { ...model } : { [modelKey]: model };

        return {
          ...instances,
          [modelKey]: model,
        };
      }, {}) as Output);

    return {
      ...context,
      ...modelInstances,
    };
  };
}

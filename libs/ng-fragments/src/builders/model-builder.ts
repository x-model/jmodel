import { Builder } from '../builder/types';
import { Type } from '../di/types';
import { ExecutionContext } from '../fragment/types';
import { BuilderConfig, ContentType, typeBuilder } from './type-builder';

export type ModelType<T> = ContentType<T>;

export function modelBuilder(
  builderConfig?: BuilderConfig
): Builder<ExecutionContext, Type<ExecutionContext>> {
  return typeBuilder(builderConfig);
}

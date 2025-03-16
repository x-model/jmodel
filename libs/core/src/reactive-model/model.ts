import {
  SignalDef,
  Unwrap,
  _,
  FIELD,
  INITIAL_VALUE,
  SCHEMA_FIELD,
} from './types';

export type SignalObject<T extends { [key: string]: unknown }> = {
  [Property in keyof T]: T[Property] extends SignalDef<
    infer SInner,
    infer SGraph
  >
    ? SInner extends { [key: string]: unknown }
      ? Unwrap<SignalObject<SInner>>
      : SInner extends symbol
      ? SGraph extends { [key: string]: unknown }
        ? Unwrap<SignalObject<SGraph>>
        : SGraph
      : SInner
    : T[Property];
};

export type ExtractedRawModel<T> = T extends SignalDef<infer M>
  ? M extends { [key: string]: unknown }
    ? Unwrap<SignalObject<M>>
    : M
  : T;

export function getRawModel<T extends SignalDef<unknown>>(
  model: T
): ExtractedRawModel<T> | any[] {
  const parsedModel = parseModel(model);

  if (parsedModel == null || typeof parsedModel !== 'object') {
    return parsedModel;
  }

  let objectModel;

  if (typeof parsedModel === 'object') {
    if (Array.isArray(parsedModel)) {
      return parsedModel.map((item) => getRawModel(item));
    } else {
      objectModel = {};

      for (const key in parsedModel) {
        const value = parsedModel[key];
        objectModel[key] = getRawModel(value);
      }
    }
  }

  return objectModel;
}

function parseModel(model): any {
  if (
    model &&
    typeof model === 'object' &&
    Reflect.ownKeys(model).includes(FIELD)
  ) {
    return model[INITIAL_VALUE];
  }

  if (
    model &&
    typeof model === 'object' &&
    Reflect.ownKeys(model).includes(SCHEMA_FIELD)
  ) {
    return _;
  }

  return model;
}

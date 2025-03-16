import {
  $Value,
  DISABLED,
  FIELD,
  FIELD_CONFIG,
  FIRST_CHANGE,
  INITIAL_VALUE,
  SCHEMA_FIELD,
} from './types';

export function $field<T>(
  value: T,
  options?: {
    readonly?: boolean;
    disabled?: boolean;
    validators?: any[];
  }
) {
  const settings = {
    [FIELD]: true,
    [INITIAL_VALUE]: value,
  };

  if (options) {
    settings[FIELD_CONFIG] = { ...options };
  }

  return settings;
}

export function $schema<T>(
  schema: T,
  options?: {
    readonly?: boolean;
    disabled?: boolean;
    validators?: any[];
  }
) {
  const settings = {
    [SCHEMA_FIELD]: schema,
  };

  if (options) {
    settings[FIELD_CONFIG] = { ...options };
  }

  return settings;
}

export const isValid = <T>(ref: $Value<T>) => {
  if (ref?.$errors) {
    return false;
  }

  let valid = true;
  const params = Object.keys(ref).filter((key) => !key.startsWith('$'));

  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    valid = valid && isValid(ref[param]);

    if (!valid) break;
  }

  return valid;
};

export const disable = <T>(ref: $Value<T>) => {
  ref[DISABLED] = true;
};

export const isDisabled = <T>(ref: $Value<T>) => {
  return !!ref[DISABLED];
};

export const enable = <T>(ref: $Value<T>) => {
  ref[DISABLED] = false;
};

export const isFirstChange = <T>(ref: $Value<T>) => {
  return !!ref[FIRST_CHANGE];
};

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

export const isValid = <T>(signal: $Value<T>) => {
  if (signal?.$errors) {
    return false;
  }

  let valid = true;
  const params = Object.keys(signal).filter((key) => !key.startsWith('$'));

  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    valid = valid && isValid(signal[param]);

    if (!valid) break;
  }

  return valid;
};

export const disable = <T>(signal: $Value<T>) => {
  signal[DISABLED] = true;
};

export const isDisabled = <T>(signal: $Value<T>) => {
  return !!signal[DISABLED];
};

export const isFirstChange = <T>(signal: $Value<T>) => {
  return !!signal[FIRST_CHANGE];
};

export const enable = <T>(signal: $Value<T>) => {
  signal[DISABLED] = false;
};

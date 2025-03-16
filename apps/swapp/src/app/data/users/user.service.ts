import { Context, disable, enable, isDisabled } from '@web-fragments/core';
import { USER_STORE } from './user.store';

export function setDefaultName(this: Context) {
  const state = this.inject(USER_STORE).state;
  state.firstName.$value = 'Chris';
}

export function toggleLastName(this: Context) {
  const state = this.inject(USER_STORE).state;

  if (isDisabled(state.lastName)) {
    enable(state.lastName);
  } else {
    disable(state.lastName);
  }
}

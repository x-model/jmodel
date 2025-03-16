import {
  $field,
  createReactiveModel,
  FACTORY,
  Lifetime,
  LIFETIME,
  required,
  TOKEN,
  Token,
} from '@web-fragments/core';

export function userStoreFactory() {
  const userModel = createReactiveModel({
    firstName: $field('', { validators: [required] }),
    lastName: $field('', { validators: [required] }),
  });

  return { state: userModel.getRefs((schema) => schema) };
}

export const USER_STORE =
  Token<ReturnType<typeof userStoreFactory>>('USER_STORE');

export const userStore = {
  [TOKEN]: USER_STORE,
  [LIFETIME]: Lifetime.scoped,
  [FACTORY]: userStoreFactory,
};

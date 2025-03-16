import {
  Context,
  FACTORY,
  Lifetime,
  LIFETIME,
  PROVIDERS,
  TOKEN,
} from '@x-model/jmodel';
import { USER_STORE, userStore } from './user.store';
import { setDefaultName, toggleLastName } from './user.service';

export const userSourceFactory = ({ inject }: Context) => ({
  setDefaultName,
  toggleLastName,
  state: inject(USER_STORE).state,
});

export const userSource = {
  [TOKEN]: Symbol('USER_SOURCE'),
  [LIFETIME]: Lifetime.scoped,
  [PROVIDERS]: {
    [USER_STORE]: userStore,
  },
  [FACTORY]: userSourceFactory,
};

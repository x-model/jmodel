import {
  FRAGMENTS,
  PublicModel,
  context,
  fragments,
  perLifetimeScope,
} from '@web-fragments/core';
import { peopleGet, peopleGetAll } from './people.data-source';
import { cardRepositoryToken } from '../../model/base/di-tokens';

const peopleRepository = {
  [FRAGMENTS]: {
    getAll: peopleGetAll,
    get: peopleGet,
  },
};

export type PeopleRepository = PublicModel<typeof peopleRepository>;

export const resolvePeopleRepository = () =>
  perLifetimeScope<PeopleRepository>(cardRepositoryToken, () =>
    context(fragments(peopleRepository[FRAGMENTS]))
  );

import {
  DEPENDENCIES,
  FRAGMENTS,
  PublicModel,
  context,
  diDependencies,
  fragments,
  perLifetimeScope,
} from '@web-fragments/core';
import { peopleGet, peopleGetAll } from './people.data-source';
import { cardRepositoryToken } from '../../model/base/di-tokens';
import { resolveHttpClient } from '../base/http-client/http-client';

const peopleRepository = {
  [DEPENDENCIES]: {
    _client: resolveHttpClient(),
  },
  [FRAGMENTS]: {
    getAll: peopleGetAll,
    get: peopleGet,
  },
};

export type PeopleRepository = PublicModel<typeof peopleRepository>;

export const resolvePeopleRepository = () =>
  perLifetimeScope<PeopleRepository>(cardRepositoryToken, () =>
    context(
      diDependencies(peopleRepository[DEPENDENCIES]),
      fragments(peopleRepository[FRAGMENTS])
    )
  );

import {
  context,
  asScoped,
  DEPENDENCIES,
  ACTIONS,
  PublicModel,
} from '@web-fragments/core';
import {
  peopleGet,
  peopleGetAll,
} from '../../data-sources/people/people.data-source';
import { cardRepositoryToken } from '../base/di-tokens';
import { httpClientResolver } from '../../data-sources/base/http-client/http-client';

export type PeopleRepository = PublicModel<typeof peopleRepository>;

const peopleRepository = {
  [DEPENDENCIES]: {
    _client: httpClientResolver,
  },
  [ACTIONS]: {
    getAll: peopleGetAll,
    get: peopleGet,
  },
};

export const peopleRepositoryResolver = () =>
  asScoped(cardRepositoryToken, () => context(peopleRepository));

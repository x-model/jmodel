import {
  context,
  fragments,
  fromFactory,
  perLifetimeScope,
  publicProps,
} from '@web-fragments/core';
import { peopleGet, peopleGetAll } from './people.data-source';
import { cardRepositoryToken } from '../../model/base/di-tokens';

export const resolvePeopleRepository = () =>
  perLifetimeScope(cardRepositoryToken, fromFactory(peopleRepositoryFactory));

export const peopleRepositoryFactory = () =>
  context(
    fragments({
      getAll: peopleGetAll,
      get: peopleGet,
    }),
    publicProps((context) => context)
  );

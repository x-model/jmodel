import { LIFETIME, Lifetime, TOKEN, FACTORY } from '@web-fragments/core';
import {
  peopleGet,
  peopleGetAll,
} from '../../data-sources/people/people.data-source';

export const peopleRepository = {
  [TOKEN]: Symbol('PEOPLE_REPOSITORY'),
  [LIFETIME]: Lifetime.transient,
  [FACTORY]: ({ execute }) => ({
    getAll: (params) => execute(peopleGetAll, params),
    get: (id) => execute(peopleGet, id),
  }),
};

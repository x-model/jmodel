import { TOKEN, FACTORY } from '@web-fragments/core';
import {
  peopleGet,
  peopleGetAll,
} from '../../data-sources/people/people.data-source';

export const peopleRepository = {
  [TOKEN]: Symbol('PEOPLE_REPOSITORY'),
  [FACTORY]: () => ({
    getAll: peopleGetAll,
    get: peopleGet,
  }),
};

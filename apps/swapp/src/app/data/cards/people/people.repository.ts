import { TOKEN, FACTORY } from '@web-fragments/core';
import { peopleGet, peopleGetAll } from './people.resource';

export const peopleRepository = {
  [TOKEN]: Symbol('PEOPLE_REPOSITORY'),
  [FACTORY]: () => ({
    getAll: peopleGetAll,
    get: peopleGet,
  }),
};

import { TOKEN, FACTORY } from '@x-model/jmodel';
import { peopleGet, peopleGetAll } from './people.resource';

export const peopleRepository = {
  [TOKEN]: Symbol('PEOPLE_REPOSITORY'),
  [FACTORY]: () => ({
    getAll: peopleGetAll,
    get: peopleGet,
  }),
};

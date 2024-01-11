import {
  context,
  asScoped,
  InjectionDef,
  DEPENDENCIES,
  ACTIONS,
  PublicModel,
} from '@web-fragments/core';
import {
  starshipGet,
  starshipGetAll,
} from '../../data-sources/starships/starship.data-source';
import { cardRepositoryToken } from '../base/di-tokens';
import { httpClientResolver } from '../../data-sources/base/http-client/http-client';

// const starshipRepositoryFactory = (context: ExecutionContext) =>
//   build(
//     from(context, 'singleInstance'),
//     fragmentsToMethods({
//       getAll: starshipGetAll,
//       get: starshipGet,
//     })
//   );

// export const starshipRepositoryFactory = (context: ExecutionContext) =>
//   fromFragments(context, {
//     getAll: starshipGetAll,
//     get: starshipGet,
//   });

export type StarshipRepository = PublicModel<typeof starshipRepository>;

const starshipRepository = {
  [DEPENDENCIES]: {
    _client: httpClientResolver,
  },
  [ACTIONS]: {
    getAll: starshipGetAll,
    get: starshipGet,
  },
};

export const starshipRepositoryResolver =
  (): InjectionDef<StarshipRepository> =>
    asScoped(cardRepositoryToken, () => context(starshipRepository));

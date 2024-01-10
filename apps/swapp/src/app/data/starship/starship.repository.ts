import {
  PublicModel,
  context,
  asScoped,
  InjectionDef,
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

// const starshipRepository = {
//   [DEPENDENCIES]: {
//     _client: resolveHttpClient,
//   },
//   [FRAGMENTS]: {
//     getAll: starshipGetAll,
//     get: starshipGet,
//   },
// };

export type StarshipRepository = PublicModel<typeof starshipRepository>;

const starshipRepository = {
  _client: httpClientResolver,
  getAll: starshipGetAll,
  get: starshipGet,
};

export const starshipRepositoryResolver =
  (): InjectionDef<StarshipRepository> =>
    asScoped(cardRepositoryToken, () => context(starshipRepository));

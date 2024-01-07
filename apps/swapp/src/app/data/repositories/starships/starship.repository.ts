import {
  DEPENDENCIES,
  FRAGMENTS,
  PublicModel,
  context,
  diDependencies,
  fragments,
  perLifetimeScope,
} from '@web-fragments/core';
import { starshipGet, starshipGetAll } from './starship.data-source';
import { cardRepositoryToken } from '../../model/base/di-tokens';
import { resolveHttpClient } from '../base/http-client/http-client';

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

const starshipRepository = {
  [DEPENDENCIES]: {
    _client: resolveHttpClient(),
  },
  [FRAGMENTS]: {
    getAll: starshipGetAll,
    get: starshipGet,
  },
};

export type StarshipRepository = PublicModel<typeof starshipRepository>;

export const resolveStarshipRepository = () =>
  perLifetimeScope<StarshipRepository>(cardRepositoryToken, () =>
    context(
      diDependencies(starshipRepository[DEPENDENCIES]),
      fragments(starshipRepository[FRAGMENTS])
    )
  );

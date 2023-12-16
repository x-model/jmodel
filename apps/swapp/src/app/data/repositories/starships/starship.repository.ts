import {
  ExecutionContext,
  fragmentsToMethods,
  fromFactory,
  perLifetimeScope,
} from '@web-fragments/core';
import { starshipGet, starshipGetAll } from './starship.data-source';
import { cardRepositoryToken } from '../../model/base/di-tokens';

const fromFragments = (context, fragments) =>
  fragmentsToMethods(fragments)(context);

// const starshipRepositoryFactory = (context: ExecutionContext) =>
//   build(
//     from(context, 'singleInstance'),
//     fragmentsToMethods({
//       getAll: starshipGetAll,
//       get: starshipGet,
//     })
//   );

export const provideStarshipRepository = () =>
  perLifetimeScope(cardRepositoryToken, fromFactory(starshipRepositoryFactory));

export const starshipRepositoryFactory = (context: ExecutionContext) =>
  fromFragments(context, {
    getAll: starshipGetAll,
    get: starshipGet,
  });

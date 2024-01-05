import {
  ExecutionContext,
  context,
  fragmentsToMethods,
  fromFactory,
  partial,
  perLifetimeScope,
  publicProps,
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

export const resolveStarshipRepository = () =>
  perLifetimeScope(cardRepositoryToken, fromFactory(starshipRepositoryFactory));

// export const starshipRepositoryFactory = (context: ExecutionContext) =>
//   fromFragments(context, {
//     getAll: starshipGetAll,
//     get: starshipGet,
//   });

export function starshipRepositoryFactory() {
  return context(
    fragmentsToMethods({
      getAll: starshipGetAll,
      get: starshipGet,
    }),
    publicProps((context) => context)
  );
}

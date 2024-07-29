// import { DEPENDENCIES, ACTIONS, PublicModel } from '@web-fragments/core';
// import {
//   starshipGet,
//   starshipGetAll,
// } from '../../data-sources/starships/starship.data-source';
// import { httpClientResolver } from '../../data-sources/base/http-client/http-client';

// // const starshipRepositoryFactory = (context: ExecutionContext) =>
// //   build(
// //     from(context, 'singleInstance'),
// //     fragmentsToMethods({
// //       getAll: starshipGetAll,
// //       get: starshipGet,
// //     })
// //   );

// // export const starshipRepositoryFactory = (context: ExecutionContext) =>
// //   fromFragments(context, {
// //     getAll: starshipGetAll,
// //     get: starshipGet,
// //   });

// export type StarshipRepository = PublicModel<typeof starshipRepository>;

// export const starshipRepository = {
//   [CONTEXT]: {
//     _client: httpClientResolver,
//     _map: () => () => console.log,
//     _store: () => STORE(),
//   },
//   [ACTIONS]: {
//     getAll: starshipGetAll,
//     get: starshipGet,
//   },
// };

// // export const starshipRepository = {
// //   // [PROTO]: {
// //   //   get,
// //   //   getAll
// //   // }
// //   [DEPENDENCIES]: {
// //     // _client: { [FACTORY]: httpClientResolver },
// //     _client: httpClientResolver,
// //   },
// //   // [ACTIONS]: {
// //   //   getAll: starshipGetAll,
// //   //   get: starshipGet,
// //   // },
// //   [ACTIONS_NEW]: {
// //     getAll: starshipGetAll,
// //     get: starshipGet,
// //   },
// // };

// // export const starshipRepositoryResolver =
// //   (): InjectionDef<StarshipRepository> =>
// //     asScoped(cardRepositoryToken, () => context(starshipRepository));

// // export const starshipRepositoryToken = {
// //   resolveFn: () => context(starshipRepository),
// //   token: cardRepositoryToken,
// // } as InjectionDef<StarshipRepository>;

// // export const starshipRepositoryToken = [
// //   () => context(starshipRepository),
// //   cardRepositoryToken,
// // ];

// import {
//   Context,
//   DEPENDENCIES,
//   InjectionDef,
//   asScoped,
//   context,
// } from '@web-fragments/core';
// import { CardModel, partialCardModel } from '../base/card.model';
// import { starshipRepository } from './starship.repository';
// import { compareStarships } from './starship-comparer';
// import { mapStarship } from './starship-mapper';
// import {
//   cardCompareToken,
//   cardMapToken,
//   cardModelToken,
// } from '../base/di-tokens';

// export const starshipModelResolver = (params: {
//   name: string;
// }): InjectionDef<CardModel> => asScoped(cardModelToken, starshipModelFactory);

// export const starshipModelFactory = (creationContext: {
//   params;
// }): Context<CardModel> =>
//   context({
//     ...partialCardModel,
//     [DEPENDENCIES]: {
//       ...partialCardModel[DEPENDENCIES],
//       _cardRepository: starshipRepository,
//       _compare: () => asScoped(cardCompareToken, () => compareStarships),
//       _map: () => asScoped(cardMapToken, () => mapStarship),
//     },
//   });

// export const starshipModelDef = [starshipModelResolver, { name: 'starship' }];

// // do testów potrzebne będą jakieś fakeScopes
// // const extend = null;
// // const partial = null;
// // const create = null;

// // export function starshipModelFactory() {
// //   const model = partialCardModel(
// //     provideStarshipRepository(),
// //     compareStarships,
// //     mapStarship
// //   );

// //   return publicCardModel(model);
// // }

// // export function starshipModelFactory() {
// //   const providers = [
// //     provideStarshipRepository(),
// //     [cardCompareToken, compareStarships],
// //     [cardMapToken, mapStarship],
// //   ];

// //   return publicCardModel(providers, partialCardModel());
// // }

// // export function starshipModelFactory(context: ExecutionContext) {
// //   return build(
// //     from(cardModel),
// //     diDependencies({
// //       cardRepository: provideStarshipRepository(),
// //     }),
// //     methods(() => ({
// //       compare: compareStarships,
// //       map: mapStarship,
// //     }))
// //   );
// // }

// // export const starshipModelFactory = (context: ExecutionContext) =>
// //   build(
// //     from(context),
// //     mergeWith(cardModel()), // Object.setPrototypeOf(Dog.prototype, Animal);
// //     diDependencies2({
// //       cardRepository: provideStarshipRepository(),
// //     }),
// //     methods(() => ({
// //       compare: compareStarships,
// //       map: mapStarship,
// //     }))
// //     // props(() => {
// //     //   const formModel = {
// //     //     errors: {},
// //     //   };
// //     //   sv(formModel, 'name');

// //     //   return {
// //     //     formModel,
// //     //   };
// //     // }),
// //     // methods(({ formModel }) => ({
// //     //   changeName: () => (formModel['name'] = 'test'),
// //     // }))
// //   );

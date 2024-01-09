import { Context, InjectionDef, asScoped } from '@web-fragments/core';
import { cardModel, CardModel } from '../base/card.model';
import { starshipRepositoryResolver } from '../../repositories/starships/starship.repository';
import { compareStarships } from './services/starship-comparer';
import { mapStarship } from './services/starship-mapper';
import {
  cardCompareToken,
  cardMapToken,
  cardModelToken,
} from '../base/di-tokens';

// const providers = diDependencies;

// const dependencies = <T extends ExecutionContext>() =>
//   diDependencies<T, any, { cardRepository: any }>({
//     cardRepository: asScoped(
//       cardRepositoryToken,
//       fromFactory(starshipRepositoryFactory)
//     ),
//   });

export const starshipModelResolver = (): InjectionDef<CardModel> =>
  asScoped(cardModelToken, starshipModelFactory);

export const starshipModelFactory = (): Context<CardModel> =>
  cardModel({
    _cardRepository: starshipRepositoryResolver,
    _compare: () => asScoped(cardCompareToken, () => compareStarships),
    _map: () => asScoped(cardMapToken, () => mapStarship),
  });

// do testów potrzebne będą jakieś fakeScopes
// const extend = null;
// const partial = null;
// const create = null;

// export function starshipModelFactory() {
//   const model = partialCardModel(
//     provideStarshipRepository(),
//     compareStarships,
//     mapStarship
//   );

//   return publicCardModel(model);
// }

// export function starshipModelFactory() {
//   const providers = [
//     provideStarshipRepository(),
//     [cardCompareToken, compareStarships],
//     [cardMapToken, mapStarship],
//   ];

//   return publicCardModel(providers, partialCardModel());
// }

// export function starshipModelFactory(context: ExecutionContext) {
//   return build(
//     from(cardModel),
//     diDependencies({
//       cardRepository: provideStarshipRepository(),
//     }),
//     methods(() => ({
//       compare: compareStarships,
//       map: mapStarship,
//     }))
//   );
// }

// export const starshipModelFactory = (context: ExecutionContext) =>
//   build(
//     from(context),
//     mergeWith(cardModel()), // Object.setPrototypeOf(Dog.prototype, Animal);
//     diDependencies2({
//       cardRepository: provideStarshipRepository(),
//     }),
//     methods(() => ({
//       compare: compareStarships,
//       map: mapStarship,
//     }))
//     // props(() => {
//     //   const formModel = {
//     //     errors: {},
//     //   };
//     //   sv(formModel, 'name');

//     //   return {
//     //     formModel,
//     //   };
//     // }),
//     // methods(({ formModel }) => ({
//     //   changeName: () => (formModel['name'] = 'test'),
//     // }))
//   );

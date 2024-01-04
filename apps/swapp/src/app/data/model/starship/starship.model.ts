import {
  ExecutionContext,
  build,
  context,
  diDependencies2,
  from,
  fromFactory,
  mergeWith,
  methods,
  partial,
  perLifetimeScope,
  props,
  publicApi,
} from '@web-fragments/core';
import { cardModel, partialCardModel } from '../base/card.model';
import { provideStarshipRepository } from '../../repositories/starships/starship.repository';
import { compareStarships } from './services/starship-comparer';
import { mapStarship } from './services/starship-mapper';
import { cardModelToken } from '../base/di-tokens';
import { sv } from 'libs/core/src/builders/store-builder';
import { draw$ } from '../base/card.fragment';

// const providers = diDependencies;

// const dependencies = <T extends ExecutionContext>() =>
//   diDependencies<T, any, { cardRepository: any }>({
//     cardRepository: perLifetimeScope(
//       cardRepositoryToken,
//       fromFactory(starshipRepositoryFactory)
//     ),
//   });

export const provideStarshipModel = () =>
  perLifetimeScope(cardModelToken, fromFactory(starshipModelFactory));

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

export function starshipModelFactory() {
  const model = partial(
    partialCardModel(),
    diDependencies2({
      cardRepository: provideStarshipRepository(),
    }),
    methods(() => ({
      compare: compareStarships,
      map: mapStarship,
    })),
    publicApi(({ _exec, store }) => ({
      state: store.state,
      query: store.query,
      draw: () => _exec(draw$),
    }))
  );

  return context({
    public: model,
  });

  // const providers = [
  //   provideStarshipRepository(),
  //   [cardCompareToken, compareStarships],
  //   [cardMapToken, mapStarship],
  // ];

  // return publicCardModel(model);
}

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

import {
  ExecutionContext,
  build,
  diDependencies,
  from,
  fromFactory,
  mergeWith,
  methods,
  perLifetimeScope,
  props,
} from '@web-fragments/core';
import { cardModel } from '../base/card.model';
import { provideStarshipRepository } from '../../repositories/starships/starship.repository';
import { compareStarships } from './services/starship-comparer';
import { mapStarship } from './services/starship-mapper';
import { cardModelToken } from '../base/di-tokens';
import { sv } from 'libs/core/src/builders/store-builder';

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

export const starshipModelFactory = (context: ExecutionContext) =>
  build(
    from(context),
    mergeWith(cardModel()), // Object.setPrototypeOf(Dog.prototype, Animal);
    diDependencies({
      cardRepository: provideStarshipRepository(),
    }),
    methods(() => ({
      compare: compareStarships,
      map: mapStarship,
    })),
    props(() => {
      const formModel = {
        errors: {},
      };
      sv(formModel, 'name');

      return {
        formModel,
      };
    }),
    methods(({ formModel }) => ({
      changeName: () => (formModel['name'] = 'test'),
    }))
  );

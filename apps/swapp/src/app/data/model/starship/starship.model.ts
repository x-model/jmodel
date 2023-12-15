import {
  ExecutionContext,
  build,
  diDependencies,
  from,
  fromFactory,
  mergeWith,
  methods,
  perLifetimeScope,
} from '@web-fragments/ng-fragments';
import { cardModel } from '../base/card.model';
import { provideStarshipRepository } from '../../repositories/starships/starship.repository';
import { compareStarships } from './services/starship-comparer';
import { mapStarship } from './services/starship-mapper';
import { cardModelToken } from '../base/di-tokens';

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
    mergeWith(cardModel()),
    diDependencies({
      cardRepository: provideStarshipRepository(),
    }),
    methods(() => ({
      compare: compareStarships,
      map: mapStarship,
    }))
  );

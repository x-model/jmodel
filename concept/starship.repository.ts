import { Injectable } from '@angular/core';
import {
  build,
  fragmentsToMethods,
  repositoryBuilder,
  registerAs,
  ExecutionContext,
  from,
  di,
  Container,
} from '@web-fragments/core';
import { starshipGet, starshipGetAll } from './starship.data-source';

@Injectable({ providedIn: 'root' })
export class StarshipRepository extends build(
  repositoryBuilder(),
  fragmentsToMethods({
    getAll: starshipGetAll,
    get: starshipGet,
  })
) {}

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

export const starshipRepositoryFactory = (context) =>
  fromFragments(context, {
    getAll: starshipGetAll,
    get: starshipGet,
  });
export const starshipRepositoryToken = Symbol('token');

export const provideStarshipRepository = (context: { _inject; contextId }) =>
  provide(
    provideStarshipRepository,
    context,
    'singleInstance',
    starshipRepositoryFactory
  );

export const provide = (
  abstract,
  context: { _inject; contextId },
  diOption: 'singleInstance',
  factory
) => {
  if (abstract[di.token]) {
    abstract[di.token] = Symbol('token');
  }

  const container = context._inject(Container);
  const scopeId = context.contextId;
  let instance = container.resolve(abstract[di.token], scopeId);

  if (!instance) {
    instance = container.register(abstract[di.token], context, diOption, {
      factory,
    });
  }

  return instance;
};

// @registerAs('singleInstance')
// export function starshipRepository ({ build }) {
//     return repository({
//         getAll: build(starshipGetAll),
//         get: build(starshipGet),
//       });
// }

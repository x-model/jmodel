import { Injectable } from '@angular/core';
import {
  build,
  fragmentsToMethods,
  repositoryBuilder,
} from '@web-fragments/ng-fragments';
import { starshipGet, starshipGetAll } from './starship.data-source';

@Injectable({ providedIn: 'root' })
export class StarshipRepository extends build(
  repositoryBuilder(),
  fragmentsToMethods({
    getAll: starshipGetAll,
    get: starshipGet,
  })
) {}

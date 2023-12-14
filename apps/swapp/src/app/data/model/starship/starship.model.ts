import { Injectable } from '@angular/core';
import {
  build,
  dependencies,
  mergeWith,
  methods,
  modelBuilder,
} from '@web-fragments/ng-fragments';
import { cardModel } from '../base/card.model';
import { StarshipRepository } from '../../repositories/starships/starship.repository';
import { compareStarships } from './services/starship-comparer';
import { mapStarship } from './services/starship-mapper';

@Injectable()
export class StarshipModel extends build(
  modelBuilder(),
  mergeWith(cardModel()),
  dependencies({
    cardRepository: StarshipRepository,
  }),
  methods(() => ({
    compare: compareStarships,
    map: mapStarship,
  }))
) {}

import { Injectable } from '@angular/core';
import {
  build,
  dependencies,
  mergeWith,
  methods,
  modelBuilder,
} from '@web-fragments/core';
import { cardModel } from '../base/card.model';
import { PeopleRepository } from '../../repositories/people/people.repository';
import { comparePeople } from './services/people-comparer';
import { mapPeople } from './services/people-mapper';

@Injectable()
export class PeopleModel extends build(
  modelBuilder(),
  mergeWith(cardModel()),
  dependencies({
    cardRepository: PeopleRepository,
  }),
  methods(() => ({
    compare: comparePeople,
    map: mapPeople,
  }))
) {}

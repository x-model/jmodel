import { Injectable } from '@angular/core';
import {
  build,
  fragmentsToMethods,
  repositoryBuilder,
} from '@web-fragments/ng-fragments';
import { peopleGet, peopleGetAll } from './people.data-source';

@Injectable({ providedIn: 'root' })
export class PeopleRepository extends build(
  repositoryBuilder(),
  fragmentsToMethods({
    getAll: peopleGetAll,
    get: peopleGet,
  })
) {}

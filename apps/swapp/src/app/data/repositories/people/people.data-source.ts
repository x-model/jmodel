import { baseGet, baseGetAll } from '../base/fragments/base-api';
import { PeopleDetailResult } from './models/people-detail-result';

export const peopleGetAll = baseGetAll('people');
export const peopleGet = baseGet<PeopleDetailResult>('people');

import { baseGet, baseGetAll } from '../base/base-data-source';
import { PeopleDetailResult } from './people-detail-result';

export const peopleGetAll = () => baseGetAll('people');
export const peopleGet = () => baseGet<PeopleDetailResult>('people');

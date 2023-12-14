import { HttpParams } from '@angular/common/http';

const isEmpty: (obj: unknown) => boolean = (obj) => !obj || Object.keys(obj).length === 0;

export const getCollectionParams = <
  T extends { [param: string]: string | number | boolean | readonly (string | number | boolean)[] }
>(
  params: T
): HttpParams => {
  if (!params || isEmpty(params)) {
    return null;
  }

  return new HttpParams({ fromObject: params });
};

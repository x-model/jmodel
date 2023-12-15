import { Type } from '@angular/core';

export type Injector = {
  get<T>(
    token: ProviderToken<T>
    // notFoundValue: undefined,
  ): T;
};

export type ProviderToken<T> = Type<T>;

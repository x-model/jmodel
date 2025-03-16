import { Observable, lastValueFrom } from 'rxjs';

export function toPromise<T>(observable: Observable<T>): Promise<T> {
  return lastValueFrom(observable);
}

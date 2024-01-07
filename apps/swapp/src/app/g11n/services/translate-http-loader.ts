import { TranslateLoader } from '@ngx-translate/core';
import { Observable, from } from 'rxjs';

export class TranslateHttpLoader implements TranslateLoader {
  constructor(
    public prefix: string = '/assets/i18n/',
    public suffix: string = '.json'
  ) {}

  public getTranslation(lang: string): Observable<Object> {
    return from(this.getTranslationResult(lang));
  }

  private async getTranslationResult(lang: string): Promise<Object> {
    const response = await fetch(`${this.prefix}${lang}${this.suffix}`);
    const result = await response.json();

    return result;
  }
}

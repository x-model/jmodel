import { LOCALE_ID, NgModule, Optional, SkipSelf } from '@angular/core';
import {
  TranslateLoader,
  TranslateModule,
  MissingTranslationHandler as ngxMissingTranslationHandler,
} from '@ngx-translate/core';
import { MissingTranslationHandler } from './services/missing-translation-handler';
import { TranslateHttpLoader } from './services/translate-http-loader';

function translateLoaderFactory(): TranslateHttpLoader {
  return new TranslateHttpLoader();
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en-US',
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
      },
      missingTranslationHandler: {
        provide: ngxMissingTranslationHandler,
        useClass: MissingTranslationHandler,
      },
    }),
  ],
  exports: [TranslateModule],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'en-US',
    },
  ],
})
export class G11nModule {
  constructor(@Optional() @SkipSelf() parentModule?: G11nModule) {
    if (parentModule) {
      throw new Error(
        'G11nModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}

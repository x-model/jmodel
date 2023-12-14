import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ContextType } from '@web-fragments/ng-fragments';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { G11nModule } from './g11n';
import { HomePageComponent } from './ui/main/pages/home-page/home-page.component';
import { LayoutComponent } from './ui/main/components/layout/layout.component';
import { ApplicationContext } from './app.context';
import { DataModule } from './data';

function appInitFactory(
  context: ContextType<typeof ApplicationContext>
): () => void {
  return () => context.init();
}

@NgModule({
  declarations: [AppComponent, HomePageComponent, LayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DataModule,
    G11nModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [ApplicationContext],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

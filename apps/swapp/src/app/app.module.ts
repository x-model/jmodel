import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Container } from '@x-model/jmodel';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { G11nModule } from './g11n';
import { HomePageComponent } from './ui/main/pages/home-page/home-page.component';
import { LayoutComponent } from './ui/main/components/layout/layout.component';
import { UserPageComponent } from './ui/user/pages/user-page/user-page.component';

function containerFactory(): Container {
  return new Container();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    G11nModule,
    MatButtonModule,
    MatToolbarModule,
    LayoutComponent,
    HomePageComponent,
    UserPageComponent,
  ],
  providers: [
    {
      provide: Container,
      useFactory: containerFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

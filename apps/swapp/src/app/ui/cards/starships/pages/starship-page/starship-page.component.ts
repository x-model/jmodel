import { Component, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';
import { ngContextBuilder } from '@web-fragments/ng-fragments';
import { CARD_COMPONENT_CONTEXT } from '../../../base/context/card-component.context';
import { starshipSource } from 'apps/swapp/src/app/data/starship/starship.model';

// @Injectable()
// export class StarshipComponentContext extends build(
//   ngContextBuilder(),
//   diDependencies({ model: starshipModelResolver })
//   // uiDependencies() // dependencies angularowe
//   // props(({ model, model: { state } }) => ({
//   //   // formModel: model.formModel,
//   //   // changeName: () => model.changeName(),
//   // }))
// ) {}
// implements CardComponentContext {}

@Injectable()
export class StarshipComponentContext extends ngContextBuilder({
  model: starshipSource,
}) {}

@Component({
  selector: 'sw-starship-page',
  standalone: true,
  imports: [TranslateModule, TwoPlayersCardsLayoutComponent],
  providers: [
    { provide: CARD_COMPONENT_CONTEXT, useClass: StarshipComponentContext },
  ],
  templateUrl: './starship-page.component.html',
  styleUrls: ['./starship-page.component.scss'],
})
export class StarshipPageComponent {
  // ctx = inject(CARD_COMPONENT_CONTEXT);
  // form = new FormGroup({
  //   name: new FormControl('test'),
  //   id: new FormControl('test'),
  //   address: new FormGroup({
  //     street: new FormControl('tset'),
  //   }),
  // });
  // getName() {
  //   this.form.get('address.street');
  //   this.form.value.address.street;
  //   const mySig = signal({counter: {id: 10, name: 'test'}});
  //   mySig.counter.
  // }
}

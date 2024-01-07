import { Component, Injectable, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { build, diDependencies } from '@web-fragments/core';
import { ngContextBuilder } from '@web-fragments/ng-fragments';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';
import { CARD_COMPONENT_CONTEXT } from '../../../../../data/model/base/card.fragment';
import { resolveStarshipModel } from '../../../../../data';
import { FormBuilder } from '@angular/forms';
// import { FormControl, FormGroup, FormsModule } from '@angular/forms';

@Injectable()
export class StarshipComponentContext extends build(
  ngContextBuilder(),
  diDependencies({ model: resolveStarshipModel() })
  // uiDependencies() // dependencies angularowe
  // props(({ model, model: { state } }) => ({
  //   // formModel: model.formModel,
  //   // changeName: () => model.changeName(),
  // }))
) {}
// implements CardComponentContext {}

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

// const myProxy = new Proxy(
//   {
//     browsers: ['Firefox', 'Chrome'],
//     test: {
//       loading: false,
//       parent: 1,
//       description: 'test'
//     }
//   },
//   {
//     get(obj, prop) {
//       console.log('get', prop);

//       return obj[prop];
//     },
//     set(obj, prop, value) {
//       console.log('set', prop, value)

//       obj[prop] = value;

//       return true;
//     },
//   }
// );

// console.log(products.browsers);
// //  ['Firefox', 'Chrome']

// products.browsers = 'Safari';

// console.log(products.browsers);

// products.latestBrowser = 'Edge';

// console.log(products.browsers);
// //  ['Safari', 'Edge']

// console.log(products.latestBrowser);
//  'Edge'

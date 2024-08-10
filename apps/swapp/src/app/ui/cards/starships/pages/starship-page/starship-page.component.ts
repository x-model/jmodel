import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';

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

@Component({
  selector: 'sw-starship-page',
  standalone: true,
  imports: [TranslateModule, TwoPlayersCardsLayoutComponent],
  providers: [
    // { provide: CARD_COMPONENT_CONTEXT, useClass: StarshipComponentContext },
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

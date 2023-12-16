import { Component, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  build,
  ngContextBuilder,
  dependencies,
  hooks,
  publicApi,
} from '@web-fragments/ng-fragments';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';
import {
  CARD_COMPONENT_CONTEXT,
  CardComponentContext,
} from '../../../../../data/model/base/card.fragment';
import { PeopleModel } from '../../../../../data';

const styles = `
  :host {
    height: 100%;
    display: block;
  }
`;

@Injectable()
export class PeopleComponentContext
  extends build(
    ngContextBuilder(),
    dependencies({ model: PeopleModel }),
    hooks(() => ({
      onInit: () => {
        console.log('people context initialized');
      },
      onDestroy: () => {
        console.log('people context destroyed');
      },
    })),
    publicApi(({ model }) => ({
      // ...store.getters
      isLoading: model.isLoading,
      player1: model.player1,
      player2: model.player2,
      draw: () => model.draw(),
    }))
    // TODO
    // nie możemy teraz robić czegoś takiego,
    // bo przepisujemy wszystkie property z modelu i potem się sypie
    // ale jak obsłużymy public api to ta opcja powinna zadziałać
    // publicApi(({ model }) => ({
    //   ...model,
    // }))
  )
  implements CardComponentContext {}

@Component({
  selector: 'sw-people-page',
  standalone: true,
  imports: [TranslateModule, TwoPlayersCardsLayoutComponent],
  providers: [
    PeopleModel,
    { provide: CARD_COMPONENT_CONTEXT, useClass: PeopleComponentContext },
  ],
  template: `
    <sw-two-players-cards-layout [title]="'CARDS.PEOPLE' | translate">
    </sw-two-players-cards-layout>
  `,
  styles: [styles],
})
export class PeoplePageComponent {}

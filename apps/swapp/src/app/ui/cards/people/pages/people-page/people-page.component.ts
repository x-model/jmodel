import { Component, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { build, diDependencies, hooks, props } from '@web-fragments/core';
import { ngContextBuilder, refToSignal } from '@web-fragments/ng-fragments';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';
import { CARD_COMPONENT_CONTEXT } from '../../../../../data/model/base/card.fragment';
import {
  isLoadingQuery,
  player1Query,
  player2Query,
} from '../../../../../data/model/base/card-store';
import { resolvePeopleModel } from '../../../../../data';

const styles = `
  :host {
    height: 100%;
    display: block;
  }
`;

@Injectable()
export class PeopleComponentContext extends build(
  ngContextBuilder(),
  diDependencies({ model: resolvePeopleModel() }),
  // hooks(() => ({
  //   onInit: () => {
  //     console.log('people context initialized');
  //   },
  //   onDestroy: () => {
  //     console.log('people context destroyed');
  //   },
  // })),
  props(({ model, model: { state } }) => ({
    isLoading: refToSignal(state, isLoadingQuery),
    player1: refToSignal(state, player1Query),
    player2: refToSignal(state, player2Query),
    // ...store.getters
    // isLoading: model.isLoading,
    // player1: model.player1,
    // player2: model.player2,
    draw: () => model.draw(),
  }))
  // TODO
  // nie możemy teraz robić czegoś takiego,
  // bo przepisujemy wszystkie property z modelu i potem się sypie
  // ale jak obsłużymy public api to ta opcja powinna zadziałać
  // publicApi(({ model }) => ({
  //   ...model,
  // }))
) {}
// implements CardComponentContext {}

@Component({
  selector: 'sw-people-page',
  standalone: true,
  imports: [TranslateModule, TwoPlayersCardsLayoutComponent],
  providers: [
    { provide: CARD_COMPONENT_CONTEXT, useClass: PeopleComponentContext },
  ],
  template: `
    <sw-two-players-cards-layout [title]="'CARDS.PEOPLE' | translate">
    </sw-two-players-cards-layout>
  `,
  styles: [styles],
})
export class PeoplePageComponent {}

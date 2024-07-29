import { Component, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { diDependencies } from '@web-fragments/core';
import { ngContextBuilder } from '@web-fragments/ng-fragments';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';
import { peopleSource } from 'apps/swapp/src/app/data';
import { CARD_COMPONENT_CONTEXT } from '../../../base/context/card-component.context';

const styles = `
  :host {
    height: 100%;
    display: block;
  }
`;

@Injectable()
export class PeopleComponentContext extends ngContextBuilder((initialContext) =>
  diDependencies({ model: peopleSource })(initialContext)
) {}

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

import { Component, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';
import { ngContextBuilder } from '@web-fragments/ng-fragments';
import { CARD_COMPONENT_CONTEXT } from '../../../base/context/card-component.context';
import { starshipSource } from '../../../../../data/cards/starship/starship.model';

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
export class StarshipPageComponent {}

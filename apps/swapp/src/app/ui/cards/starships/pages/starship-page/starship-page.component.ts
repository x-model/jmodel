import { Component, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  build,
  contextBuilder,
  diDependencies,
  publicApi,
} from '@web-fragments/ng-fragments';
import { TwoPlayersCardsLayoutComponent } from '../../../base/components/two-players-cards-layout/two-players-cards-layout.component';
import {
  CARD_COMPONENT_CONTEXT,
  CardComponentContext,
} from '../../../../../data/model/base/card.fragment';
import { provideStarshipModel } from '../../../../../data';

@Injectable()
export class StarshipComponentContext
  extends build(
    contextBuilder(),
    diDependencies({ model: provideStarshipModel() }),
    publicApi(({ model }) => ({
      // ...store.getters
      isLoading: model.isLoading,
      player1: model.player1,
      player2: model.player2,
      draw: () => model.draw(),
    }))
  )
  implements CardComponentContext {}

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

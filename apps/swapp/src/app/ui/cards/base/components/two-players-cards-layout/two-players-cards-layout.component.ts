import { Component, Input, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { refToSignal } from '@web-fragments/ng-fragments';
import { CardsLayoutComponent } from '../cards-layout/cards-layout.component';
import { CardPlayerComponent } from '../card-player/card-player.component';
import { CARD_COMPONENT_CONTEXT } from '../../../../../data/model/base/card.fragment';
import {
  isLoadingQuery,
  player1Query,
  player2Query,
} from '../../../../../data/model/base/card-store';

@Component({
  selector: 'sw-two-players-cards-layout',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
    CardsLayoutComponent,
    CardPlayerComponent,
  ],
  templateUrl: './two-players-cards-layout.component.html',
  styleUrls: ['./two-players-cards-layout.component.scss'],
})
export class TwoPlayersCardsLayoutComponent {
  @Input() title: string;

  private readonly model = inject(CARD_COMPONENT_CONTEXT).model;
  isLoading = refToSignal(this.model.state, isLoadingQuery);
  player1 = refToSignal(this.model.state, player1Query);
  player2 = refToSignal(this.model.state, player2Query);

  draw(): void {
    this.model.draw();
  }
}

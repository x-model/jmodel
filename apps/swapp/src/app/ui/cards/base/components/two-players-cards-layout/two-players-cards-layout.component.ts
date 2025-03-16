import { Component, Input, Signal, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardsLayoutComponent } from '../cards-layout/cards-layout.component';
import { CardPlayerComponent } from '../card-player/card-player.component';
import { CARD_COMPONENT_CONTEXT } from '../../context/card-component.context';
import { refToSignal } from '@web-fragments/ng-fragments';
import { CardPlayer } from '../../../../../data/cards/base/models/card-player';

@Component({
  selector: 'sw-two-players-cards-layout',
  standalone: true,
  imports: [TranslateModule, CardsLayoutComponent, CardPlayerComponent],
  templateUrl: './two-players-cards-layout.component.html',
  styleUrls: ['./two-players-cards-layout.component.scss'],
})
export class TwoPlayersCardsLayoutComponent {
  @Input() title: string;

  private readonly model = inject(CARD_COMPONENT_CONTEXT)?.model;
  isLoading: Signal<boolean> = refToSignal(this.model.refs.isLoading as any);
  player1: Signal<CardPlayer> = refToSignal(this.model.refs.player1 as any);
  player2: Signal<CardPlayer> = refToSignal(this.model.refs.player2 as any);

  draw(): void {
    this.model.draw();
  }
}

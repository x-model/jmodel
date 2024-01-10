import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Card } from '../../../../../data/base/models/card';

@Component({
  selector: 'sw-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() card: Card;
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'sw-cards-layout',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule],
  templateUrl: './cards-layout.component.html',
  styleUrls: ['./cards-layout.component.scss'],
})
export class CardsLayoutComponent {
  @Input() title: string;
  @Input() isLoading: boolean;
  @Output() draw: EventEmitter<void> = new EventEmitter();
}

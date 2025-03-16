import { Component, Injectable, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { isFirstChange, isValid } from '@x-model/jmodel';
import { ngContextBuilder, refToSignal } from '@x-model/ng-model';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { userSource } from '../../../../data/users/user.model';

@Injectable()
export class UserComponentContext extends ngContextBuilder({
  model: userSource,
}) {}

@Component({
  selector: 'sw-user-page',
  standalone: true,
  imports: [TranslateModule, FormsModule, JsonPipe, NgIf],
  providers: [UserComponentContext],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent {
  ctx = inject(UserComponentContext);
  model = (this.ctx as any).model;
  form = this.model.state;
  firstName = refToSignal(this.model.state.firstName);

  setDefaultName(): void {
    this.model.setDefaultName();
  }

  toggleLastName(): void {
    this.model.toggleLastName();
  }

  isValid() {
    return isValid(this.model);
  }

  isTouched(ref) {
    return isFirstChange(ref);
  }
}

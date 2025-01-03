import { Component, Injectable, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  $field,
  FACTORY,
  LIFETIME,
  Lifetime,
  TOKEN,
  Token,
  createReactiveModel,
  disable,
  enable,
  isDisabled,
  isFirstChange,
  isValid,
  required,
} from '@web-fragments/core';
import { ngContextBuilder } from '@web-fragments/ng-fragments';
import { FormBuilder, FormsModule } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';

export const createProfileForm = (state) => {
  const form = inject(FormBuilder).group({
    firstName: [state?.firstName || ''],
    lastName: [state?.lastName || ''],
  });

  const updateForm = (profile: any): void => {
    form.patchValue({
      firstName: profile?.firstName,
      lastName: profile?.lastName,
    });
  };

  return { form, updateForm };
};

type UserState = { firstName: string; lastName: string };

export function storeFactory() {
  const userModel = createReactiveModel({
    firstName: $field('', { validators: [required] }),
    lastName: $field('', { validators: [required] }),
  } as any);

  const model = userModel.getRefs((schema) => schema);

  return model;
}

const USER_STORE = Token<ReturnType<typeof storeFactory>>('USER_STORE');

export const userStore = {
  [TOKEN]: USER_STORE,
  [LIFETIME]: Lifetime.scoped,
  [FACTORY]: storeFactory,
};

@Injectable()
export class UserComponentContext extends ngContextBuilder({
  model: userStore,
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

  firstName = '';
  value = { name: '' };

  updateName() {
    this.model.firstName.$value = 'Jacek';
  }

  toggleLastName() {
    if (isDisabled(this.model.lastName)) {
      enable(this.model.lastName);
    } else {
      disable(this.model.lastName);
    }
  }

  isValid() {
    return isValid(this.model);
  }

  isTouched(signal) {
    return isFirstChange(signal);
  }
}

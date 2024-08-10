import { Component, Injectable, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  $,
  Context,
  FACTORY,
  LIFETIME,
  Lifetime,
  PROVIDERS,
  ReactiveModel,
  TOKEN,
  Token,
  createReactiveModel,
  disable,
  isValid,
} from '@web-fragments/core';
import { ngContextBuilder } from '@web-fragments/ng-fragments';
import { FormBuilder, FormsModule } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import {
  enable,
  isDisabled,
  isFirstChange,
} from 'libs/core/src/reactive-model/reactive-model';

const required = (value: any, state: any) => {
  return !value ? { required: true } : null;
};

export const userModel = {
  firstName: $('', [required]),
  lastName: $('', [required]),
};

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
  const model: ReactiveModel<UserState> = createReactiveModel(
    userModel
  ) as unknown as ReactiveModel<UserState>;

  return {
    state: model,
    graph: model.graph,
    signals: model.signals,
  };
}

const Store: Token<ReturnType<typeof storeFactory>> = Symbol('Store');

export const userStore = {
  [TOKEN]: Store,
  [LIFETIME]: Lifetime.scoped,
  [FACTORY]: storeFactory,
};

export const sourceFactory = ({ inject, execute }: Context) => ({
  signals: inject(Store).signals,
});

export const userSource = {
  [TOKEN]: Symbol('USER_SOURCE'),
  [LIFETIME]: Lifetime.scoped,
  [PROVIDERS]: {
    [Store]: userStore,
  },
  [FACTORY]: sourceFactory,
};

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
  model = this.ctx.inject(Store)?.signals;

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

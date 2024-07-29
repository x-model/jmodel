import { InjectionToken } from '@angular/core';
import { CardContext } from 'apps/swapp/src/app/data/base/models/card-context';

export const CARD_COMPONENT_CONTEXT = new InjectionToken<CardContext>(
  'CARD_COMPONENT_CONTEXT'
);

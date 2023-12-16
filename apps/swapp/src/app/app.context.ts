import { build, ngContextBuilder, methods } from '@web-fragments/ng-fragments';

export const ApplicationContext = build(
  ngContextBuilder({ providedIn: 'root' }),
  methods(() => ({
    init: () => console.log('app initialized'),
  }))
);

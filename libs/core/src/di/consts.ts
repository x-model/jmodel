import { Context } from '../fragment/types';
import { Lifetime } from './lifetime';
import { InjectionToken } from './types';

export const INJECTABLE = Symbol('INJECTABLE');
export const TOKEN = Symbol('TOKEN');
export const LIFETIME = Symbol('LIFETIME');
export const FACTORY = Symbol('FACTORY');
export const PROVIDERS = Symbol('PROVIDERS');

export type FactoryResult<T extends (context: Context) => unknown> =
  ReturnType<T> & Context;

export type Token<T> = Partial<{ _: T }> & symbol;

export function injectionToken<T>(description: string): InjectionToken<T> {
  return { token: Symbol(description) };
}

export const di = {
  token: Symbol.toPrimitive,
};

// co gdybyśmy chcieli utworzyć kilka instancji?
export function registerAs<T extends Function>(
  lifetime: Lifetime,
  fnRef: T
): [T, Lifetime] {
  if (fnRef[di.token]) {
    return [fnRef, lifetime];
  }

  fnRef[di.token] = Symbol('token');

  return [fnRef, lifetime];
}

// var builder = new ContainerBuilder();
// builder.RegisterType<Worker>().InstancePerLifetimeScope();

// public static void WriteDate()
//   {
//     // Create the scope, resolve your IDateWriter,
//     // use it, then dispose of the scope.
//     using (var scope = Container.BeginLifetimeScope())
//     {
//       var writer = scope.Resolve<IDateWriter>();
//       writer.WriteDate();
//     }
//   }
// var builder = new ContainerBuilder();
// builder.RegisterType<Worker>().InstancePerMatchingLifetimeScope('my-request');

// builder.RegisterType<Worker>().InstancePerDependency();

// var builder = new ContainerBuilder();
// builder.RegisterType<Worker>().SingleInstance();

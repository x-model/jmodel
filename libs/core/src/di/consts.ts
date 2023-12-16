export const di = {
  token: Symbol.toPrimitive,
};

// co gdybyśmy chcieli utworzyć kilka instancji?
export function registerAs<T extends Function>(
  option: 'singleInstance' | 'instancePerLifetimeScope',
  fnRef: T
): [T, string] {
  if (fnRef[di.token]) {
    return [fnRef, option];
  }

  fnRef[di.token] = Symbol('token');

  return [fnRef, option];
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

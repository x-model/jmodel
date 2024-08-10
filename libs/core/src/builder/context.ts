import { diDependencies } from '../builder-props/di-dependencies';
import { props } from '../builder-props/props';
import { INJECTABLE, injectionToken } from '../di/consts';
import { asTransient } from '../di/lifetime';
import {
  InjectionDef,
  InjectionResult,
  InjectionToken,
  Scope,
} from '../di/types';
import { ExecutionContext } from '../fragment/types';
import { Unwrap } from '../types';
import { BuilderPartialContext, BuilderStepConfig } from './types';

export const WATCH = Symbol('WATCH');
export const VALUE = Symbol('VALUE');
export const MODEL = Symbol('MODEL');
export const ACTIONS = Symbol('ACTIONS');
export const DEPENDENCIES = Symbol('DEPENDENCIES');
export const SERVICE = Symbol('SERVICE');
export const STORE = Symbol('STORE');
export const REPOSITORY = Symbol('REPOSITORY');

export type PublicModelStore<T> = T extends {
  [STORE]: infer S extends () =>
    | InjectionToken<{ state: unknown }>
    | InjectionDef<{ state: unknown }>;
}
  ? {
      state: InjectionResult<ReturnType<S>>['state'];
    }
  : never;

export type ModelStore<T> = T extends {
  [STORE]: infer S extends () =>
    | InjectionToken<{ state: unknown }>
    | InjectionDef<{ state: unknown }>;
}
  ? {
      _store: InjectionResult<ReturnType<S>>;
      state: InjectionResult<ReturnType<S>>['state'];
    }
  : never;

export type ModelDependencies<T> = T extends {
  [DEPENDENCIES]: infer D extends Record<
    string,
    ModelDef | (() => InjectionToken<unknown> | InjectionDef<unknown>)
  >;
}
  ? {
      [P in keyof D]: D[P] extends ModelDef
        ? Model<D[P]>
        : D[P] extends () => InjectionToken<unknown> | InjectionDef<unknown>
        ? InjectionResult<ReturnType<D[P]>>
        : never;
    }
  : never;

export type ModelActions<T> = T extends {
  [ACTIONS]: infer A extends Record<string, (args: unknown) => unknown>;
}
  ? {
      [P in keyof A]: A[P];
    }
  : never;

export type ModelActionsOld<T> = T extends {
  [ACTIONS]: infer A extends Record<string, () => InjectionDef<unknown>>;
}
  ? {
      [P in keyof A]: InjectionResult<ReturnType<A[P]>>;
    }
  : never;

export type ModelService<T> = T extends {
  [SERVICE]: infer S extends Record<string, () => InjectionDef<unknown>>;
}
  ? {
      [P in keyof S]: InjectionResult<ReturnType<S[P]>>;
    }
  : never;

export type PublicProps<T> = {
  [P in keyof T as Capitalize<string & P> extends P ? never : P]: T[P];
};

export type ModelDef = {
  [DEPENDENCIES]?: unknown;
  [ACTIONS]?: unknown;
  [SERVICE]?: unknown;
  [STORE]?: unknown;
};

export type InternalModel<T> = T extends {
  [DEPENDENCIES]: unknown;
  [ACTIONS]: unknown;
  [SERVICE]: unknown;
  [STORE]: unknown;
}
  ? Unwrap<
      ModelDependencies<T> & ModelActions<T> & ModelService<T> & ModelStore<T>
    >
  : T extends {
      [DEPENDENCIES]: unknown;
      [ACTIONS]: unknown;
      [SERVICE]: unknown;
    }
  ? Unwrap<ModelDependencies<T> & ModelActions<T> & ModelService<T>>
  : T extends {
      [DEPENDENCIES]: unknown;
      [ACTIONS]: unknown;
      [STORE]: unknown;
    }
  ? Unwrap<ModelDependencies<T> & ModelActions<T> & ModelStore<T>>
  : T extends {
      [DEPENDENCIES]: unknown;
      [SERVICE]: unknown;
      [STORE]: unknown;
    }
  ? Unwrap<ModelDependencies<T> & ModelService<T> & ModelStore<T>>
  : T extends {
      [ACTIONS]: unknown;
      [SERVICE]: unknown;
      [STORE]: unknown;
    }
  ? Unwrap<ModelActions<T> & ModelService<T> & ModelStore<T>>
  : T extends {
      [DEPENDENCIES]: unknown;
      [ACTIONS]: unknown;
    }
  ? Unwrap<ModelDependencies<T> & ModelActions<T>>
  : T extends {
      [DEPENDENCIES]: unknown;
      [SERVICE]: unknown;
    }
  ? Unwrap<ModelDependencies<T> & ModelService<T>>
  : T extends {
      [ACTIONS]: unknown;
      [SERVICE]: unknown;
    }
  ? Unwrap<ModelActions<T> & ModelService<T>>
  : T extends {
      [DEPENDENCIES]: unknown;
    }
  ? ModelDependencies<T>
  : T extends { [ACTIONS]: unknown }
  ? ModelActions<T>
  : T extends { [SERVICE]: unknown }
  ? ModelService<T>
  : never;

export type Model<T> = T extends { [ACTIONS]: unknown; [STORE]: unknown }
  ? Unwrap<ModelActions<T> & PublicModelStore<T>>
  : T extends { [ACTIONS]: unknown }
  ? ModelActions<T>
  : T extends { [STORE]: unknown }
  ? PublicModelStore<T>
  : never;

// export type PublicModel<
//   T extends Record<
//     string,
//     () => InjectionToken<unknown> | InjectionDef<unknown>
//   >
// > = Unwrap<PublicProps<ModelDependencies<T>>>;

export type PublicModel<
  T extends Record<
    symbol,
    | Record<
        string,
        | ((args: any) => unknown)
        | ModelDef
        | (() => InjectionToken<unknown> | InjectionDef<unknown>)
      >
    | (() => InjectionToken<unknown> | InjectionDef<unknown>)
  >
> = Unwrap<Model<T>>;

export type Context<T> = (scope: Scope) => PublicProps<T>;

export type BuilderContext = Omit<ExecutionContext, '_exec'>;

export function context<
  Input extends Record<
    symbol,
    | Record<
        string,
        | ((args: any) => unknown)
        | ModelDef
        | (() => InjectionToken<unknown> | InjectionDef<unknown>)
      >
    | (() => InjectionToken<unknown> | InjectionDef<unknown>)
  >
>(s1: Input): Context<Unwrap<Model<Input>>>;
export function context<
  Input extends Record<
    symbol,
    | Record<
        string,
        ModelDef | (() => InjectionToken<unknown> | InjectionDef<unknown>)
      >
    | (() => InjectionToken<unknown> | InjectionDef<unknown>)
  >,
  T1 extends BuilderPartialContext
>(
  s1: Input,
  s2: BuilderStepConfig<
    Unwrap<InternalModel<Input>> & Unwrap<BuilderContext>,
    T1
  >
): Context<T1>;

export function context(s1: any): any {
  const factory = (scope: Scope) => {
    // const container = scope.rootInjector.get(Container);

    const extractedDependencies = Reflect.ownKeys(s1).reduce((obj, key) => {
      let item = s1[key];

      if (key === DEPENDENCIES) {
        item = Object.keys(item).reduce((deps, depKey) => {
          let dep = item[depKey];

          if (typeof dep === 'object' && !Array.isArray(dep)) {
            const contextDef = { ...dep };

            dep = () =>
              asTransient(injectionToken('dependecy'), () =>
                context({ ...contextDef })
              );
          }

          return { ...deps, [depKey]: dep };
        }, {});
      }

      const result = { ...obj, ...item };

      return result;
    }, {});

    const hasStore = !!s1[STORE];
    const deps = diDependencies({
      ...extractedDependencies,
      ...(hasStore ? { _store: s1[STORE] } : {}),
    });

    let stateProps;

    if (hasStore) {
      stateProps = props((ctx: any) => ({ state: ctx._store.state }));
    }

    const steps = [deps, ...(hasStore ? [stateProps] : [])];

    // let result = contextBuilder(scope, (initialContext) => ({
    //   ...steps.reduce((context, step) => step(context), initialContext),
    //   ...(s1[ACTIONS]
    //     ? Object.keys(s1[ACTIONS]).reduce(
    //         (obj, key) => ({ ...obj, [key]: s1[ACTIONS][key] }),
    //         {}
    //       )
    //     : {}),
    // })) as ExecutionContext & Hooks;

    // if (result?.onInit) {
    //   result.onInit();
    // }

    return null; // result;
  };

  factory[INJECTABLE] = true;

  return factory;
}

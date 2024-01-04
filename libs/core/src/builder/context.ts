import { typeBuilder } from '../builders/type-builder';

export function context(config: {
  providers?: any;
  internal?: any;
  public?: any;
}): any {
  return (scope) => {
    const build = typeBuilder();
    const result = build(config.public);

    return new result(scope);
  };
}

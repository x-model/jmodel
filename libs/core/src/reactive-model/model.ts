export function createModel<T>(model: T): T {
  return structuredClone(model);
}

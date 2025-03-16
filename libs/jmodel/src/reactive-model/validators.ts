export function required<T>(value: T): { required: boolean } {
  return !value ? { required: true } : null;
}

export function min<T>(value: T, options?: any): { min: boolean } {
  console.log('min validator');
  return null;
}

export function max<T>(value: T, options?: any): { max: boolean } {
  console.log('max validator');
  return null;
}

export const snakeToCamel = (str: string): string =>
  str.toLowerCase().replace(/[-_][a-z0-9]/g, (group: string) => group.slice(-1).toUpperCase());

export const camelToSnake = (str: string): string => str.replace(/([A-Z0-9])/g, ($1: string) => `_${$1.toLowerCase()}`);

export const convertStringNumberToNumber = (str: string | 'unknown' | 'n/a', locale = 'en-US'): number => {
  if (['unknown', 'n/a'].includes(str)) {
    return 0;
  }

  const { format } = new Intl.NumberFormat(locale);
  const [, decimalSign] = /^0(.)1$/.exec(format(0.1));
  return +str.replace(new RegExp(`[^${decimalSign}\\d]`, 'g'), '').replace(decimalSign, '.');
};

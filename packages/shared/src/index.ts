export const DEFAULT_TIMEZONE = 'Europe/Rome';
export const redact = (value: string): string =>
  value.length <= 4 ? '••••' : `${value.slice(0, 2)}••••${value.slice(-2)}`;

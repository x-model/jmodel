export type CardProperty = {
  translationKey: string;
  value: string;
  rawValue: unknown;
};

export type Card = {
  title: string;
  subtitle?: string;
  properties: { [key: string]: CardProperty };
};

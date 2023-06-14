// List of BCP 47 locale string
// Not exhaustive, might add more later
export const SUPPORTED_LOCALES = [
  'en-US',
  'en-GB',
  'en-SG',
  'id-ID',
  'fr-FR',
  'it-IT',
  'ja-JP',
  'ko-KR',
  'pt-BR',
  'ru-RU',
  'zh-CN',
  'zh-TW',
] as const;

export const SUPPORTED_CURRENCIES = [
  'USD',
  'GBP',
  'SGD',
  'IDR',
  'EUR',
  'JPY',
  'KRW',
  'BRL',
  'RUB',
  'CNY',
  'TWD',
] as const;

export type LocaleTag = typeof SUPPORTED_LOCALES[number];
export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number];

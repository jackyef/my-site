import { LocaleTag } from './locale';

export const TODAY = new Date();

const dateFormatter: Map<string, Intl.DateTimeFormat> = new Map();

const getDateFormatter = (languageKey: string, withTime: boolean) => {
  const cacheKey = `${languageKey}${withTime}`;
  if (dateFormatter.get(cacheKey)) return dateFormatter.get(cacheKey);

  dateFormatter.set(
    cacheKey,
    new Intl.DateTimeFormat(languageKey, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...(withTime ? { hour: 'numeric', minute: 'numeric' } : {}),
    }),
  );

  return dateFormatter.get(cacheKey);
};

export const formatDate = (
  date: Date,
  withTime = false,
  languageKey: LocaleTag = 'en-US',
) => getDateFormatter(languageKey, withTime)?.format(date);

const monthFormatter: Map<string, Intl.DateTimeFormat> = new Map();

const getMonthFormatter = (languageKey: string, withYear: boolean) => {
  const cacheKey = `${languageKey}${withYear}`;
  if (monthFormatter.get(cacheKey)) return monthFormatter.get(cacheKey);

  monthFormatter.set(
    cacheKey,
    new Intl.DateTimeFormat(languageKey, {
      month: 'long',
      year: withYear ? 'numeric' : undefined,
    }),
  );

  return monthFormatter.get(cacheKey);
};

export const formatMonth = (
  date: Date,
  withYear = false,
  languageKey: LocaleTag = 'en-US',
) => getMonthFormatter(languageKey, withYear)?.format(date);

export const getMonthDifference = (a: Date, b: Date) => {
  return (
    (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  );
};

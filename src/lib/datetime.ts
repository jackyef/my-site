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

const getMonthFormatter = (
  languageKey: string,
  withYear: boolean,
  monthFormat: Intl.DateTimeFormatOptions['month'],
) => {
  const cacheKey = `${languageKey}${withYear}${monthFormat}`;
  if (monthFormatter.get(cacheKey)) return monthFormatter.get(cacheKey);

  monthFormatter.set(
    cacheKey,
    new Intl.DateTimeFormat(languageKey, {
      month: monthFormat,
      year: withYear ? 'numeric' : undefined,
    }),
  );

  return monthFormatter.get(cacheKey);
};

export const formatMonth = (
  date: Date,
  withYear = false,
  languageKey: LocaleTag = 'en-US',
  monthFormat: Intl.DateTimeFormatOptions['month'] = 'long',
) => getMonthFormatter(languageKey, withYear, monthFormat)?.format(date);

/**
 * Format a date-only string (e.g. "2024-01-15") in UTC to avoid
 * timezone-dependent hydration mismatches.
 */
const utcPostDateFormatter = new Intl.DateTimeFormat('en-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const utcPostDateLongFormatter = new Intl.DateTimeFormat('en-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// We format strictly in UTC to avoid hydration mismatches 
// due to timezone differences between server and client
export const formatPostDate = (dateStr: string, long = false) =>
  (long ? utcPostDateLongFormatter : utcPostDateFormatter).format(
    new Date(dateStr),
  );

export const getMonthDifference = (a: Date, b: Date) => {
  return (
    (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth())
  );
};

export const getTimeDifference = (a: Date, b: Date) => {
  const monthDiff = getMonthDifference(a, b);

  if (monthDiff < 1) {
    return `1m`;
  }

  if (monthDiff < 11) {
    return `${monthDiff + 1}m`;
  }

  if (monthDiff === 11) {
    return `1y`;
  }

  const years = Math.floor(monthDiff / 12);
  const months = (monthDiff % 12) + 1;

  if (months === 12) {
    return `${years + 1}y`;
  }

  return `${years}y ${months}m`;
};

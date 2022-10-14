let formatter: Intl.RelativeTimeFormat;

const getRelativeTime = (value: number, units: Intl.RelativeTimeFormatUnit) => {
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat('en', { style: 'narrow' });
  }

  return formatter.format(value, units);
};

export const getRelativeTimeFromNow = (date: Date) => {
  const diffDays = Math.round(
    (date.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays === 0) {
    return 'today';
  }

  return getRelativeTime(diffDays, 'days');
};

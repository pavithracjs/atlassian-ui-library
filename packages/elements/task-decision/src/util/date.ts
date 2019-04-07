// Only bring in the subset of date-fns that we use
import format from 'date-fns/format';
import isSameDay from 'date-fns/is_same_day';
import isToday from 'date-fns/is_today';
import isYesterday from 'date-fns/is_yesterday';
import isThisYear from 'date-fns/is_this_year';
import startOfDay from 'date-fns/start_of_day';

const DATE_FORMAT_SAME_YEAR = 'MMMM D';
const DATE_FORMAT_PAST_YEAR = 'MMMM D, YYYY';

export const getFormattedDate = (ts: Date): string => {
  // FIXME i18n messages
  if (isToday(ts)) {
    return 'Today';
  }
  if (isYesterday(ts)) {
    return 'Yesterday';
  }
  if (isThisYear(ts)) {
    return format(ts, DATE_FORMAT_SAME_YEAR);
  }
  return format(ts, DATE_FORMAT_PAST_YEAR);
};

export const getStartOfDate = (ts: Date): Date => {
  return startOfDay(ts);
};

export const isSameDate = (
  d1: Date | undefined,
  d2: Date | undefined,
): boolean => {
  return !!(d1 && d2 && isSameDay(d1, d2));
};

import { DateTime } from 'luxon';

export function getCanonicalTimeZone(tz: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz }).resolvedOptions()
    .timeZone;
}

export function isValidTimeZone(tz: string): boolean {
  const canonicalTz = getCanonicalTimeZone(tz);
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: canonicalTz });
    return true;
  } catch (error) {
    if (error instanceof RangeError) {
      return false;
    }
    throw error;
  }
}

export function convertLoacalTimeAndDateToUtc(
  utcDateOfStartOfDay: Date,
  timeString: string,
  timeZone: string,
): Date {
  const currentDayLocalTZ = DateTime.fromJSDate(utcDateOfStartOfDay, {
    zone: 'utc',
  }).setZone(timeZone);
  const datePartInLoaclTZ = currentDayLocalTZ.toFormat('yyyy-MM-dd');

  const localString = `${datePartInLoaclTZ}T${timeString}`;
  const zonedTime = DateTime.fromISO(localString, { zone: timeZone });
  const utcTime = zonedTime.toUTC();
  return utcTime.toJSDate();
}

export function getUtcRangeForLocalDay(
  localDateISO: string,
  userTimeZone: string,
): { startUtc: Date; endUtc: Date } {
  const userLocalDateTime = DateTime.fromISO(localDateISO, {
    zone: userTimeZone,
  });

  if (!userLocalDateTime.isValid) {
    throw new Error(
      `Invalid date string ('${localDateISO}') or time zone ('${userTimeZone}') provided. ` +
        `Luxon error: ${userLocalDateTime.invalidReason} - ${userLocalDateTime.invalidExplanation}`,
    );
  }

  const userLocalStartOfDay = userLocalDateTime.startOf('day');
  const userLocalEndOfDay = userLocalDateTime.endOf('day');

  const startUtc = userLocalStartOfDay.toUTC().toJSDate();
  const endUtc = userLocalEndOfDay.toUTC().toJSDate();

  return { startUtc, endUtc };
}

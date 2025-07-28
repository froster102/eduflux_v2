import { DateTime } from 'luxon';

export function getAllTimeZones() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const timeZones = (Intl as any).supportedValuesOf('timeZone') as string[];

  return new Set(
    timeZones.filter((timeZone) => {
      return timeZone !== 'UTC';
    }),
  );
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

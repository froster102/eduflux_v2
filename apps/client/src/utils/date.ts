import {
  format,
  parseISO,
  formatRelative as dateFnsFormatRelative,
} from 'date-fns';
import { DateFormatter, parseAbsolute } from '@internationalized/date';

export function formatISOstring(ISOstring: string) {
  if (ISOstring) {
    const dateObj = parseISO(ISOstring);

    const formattedDate = format(dateObj, 'MMM dd, yyy hh:mm:ss a');

    return formattedDate;
  }

  return '';
}

export function formatTo12Hour(date: Date) {
  return format(date, 'hh:mm:ss a');
}

export function formatTo12HourWithDate(date: Date) {
  const formatter = new DateFormatter('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return formatter.format(date);
}

export function getGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

export function convertISTToUTC(dateStr: string, timeStr: string) {
  const istDate = new Date(`${dateStr}T${timeStr}+05:30`);

  return new Date(istDate).toISOString();
}

export function convertToUTC(dateStr: string, timeStr: string) {
  const combinedStr = `${dateStr}T${timeStr}`;

  const date = new Date(combinedStr);

  return date.toISOString();
}

export function getAllTimeZones() {
  const timeZones = (Intl as any).supportedValuesOf('timeZone') as string[];

  return new Set(timeZones);
}

export function getCurrentTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function convertIsoUtcToLocalDate(isoDateString: string) {
  return parseAbsolute(isoDateString, getCurrentTimeZone());
}

export function formatSessionDataTime(
  startTime: string,
  endTime: string,
  timeZone: string = getCurrentTimeZone(),
) {
  const start = parseAbsolute(startTime, timeZone);
  const end = parseAbsolute(endTime, timeZone);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone,
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  });

  const formattedDate = dateFormatter.format(start.toDate());
  const formattedStartTime = timeFormatter
    .format(start.toDate())
    .replace(':', '.');
  const formattedEndTime = timeFormatter.format(end.toDate()).replace(':', '.');

  const durationMs = end.toDate().getTime() - start.toDate().getTime();
  const durationMins = Math.round(durationMs / 60000);

  return {
    date: formattedDate,
    timeRange: `${formattedStartTime} - ${formattedEndTime}`,
    duration: `${durationMins}m`,
  };
}

export function formatRelative(ISOstring: string): string {
  const targetDate = parseISO(ISOstring);
  const now = new Date();

  const formattedRelative = dateFnsFormatRelative(targetDate, now);

  let output = '';

  if (formattedRelative.startsWith('today')) {
    output = 'today';
  } else if (formattedRelative.startsWith('yesterday')) {
    output = 'yesterday';
  } else {
    output = format(targetDate, 'MM/dd/yyyy');
  }

  return output;
}

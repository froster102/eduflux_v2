import { format, parseISO } from "date-fns";
import { DateFormatter } from "@internationalized/date";

export function formatISOstring(ISOstring: string) {
  if (ISOstring) {
    const dateObj = parseISO(ISOstring);

    const formattedDate = format(dateObj, "MMM dd, yyy hh:mm:ss a");

    return formattedDate;
  }

  return "";
}

export function formatTo12Hour(date: Date) {
  return format(date, "hh:mm:ss a");
}

export function formatTo12HourWithDate(date: Date) {
  const formatter = new DateFormatter("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date);
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

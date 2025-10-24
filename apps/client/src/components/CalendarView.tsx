import type { DateValue } from "@react-types/calendar";

import React from "react";
import { Calendar } from "@heroui/calendar";
import {
  today,
  getLocalTimeZone,
  startOfWeek,
  startOfMonth,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { Button, ButtonGroup } from "@heroui/button";

export default function CalendarView() {
  let defaultDate = today(getLocalTimeZone());
  let [value, setValue] = React.useState<DateValue | null>(defaultDate);
  let { locale } = useLocale();

  let now = today(getLocalTimeZone());
  let nextWeek = startOfWeek(now.add({ weeks: 1 }), locale);
  let nextMonth = startOfMonth(now.add({ months: 1 }));

  return (
    <Calendar
      isReadOnly
      calendarWidth={372}
      className="shrink-0 h-[358px] border-none dark:border-default-100 overflow-hidden"
      classNames={{
        cell: "px-2 w-full",
        gridBodyRow: "gap-x-1 px-3 mb-1 first:mt-4 last:mb-0",
        gridHeader: "px-2",
        gridHeaderCell: "px-2 md:w-full",
      }}
      focusedValue={value}
      showShadow={false}
      topContent={
        <ButtonGroup
          fullWidth
          className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
          radius="full"
          size="sm"
          variant="bordered"
        >
          <Button onPress={() => setValue(now)}>Today</Button>
          <Button onPress={() => setValue(nextWeek)}>Next week</Button>
          <Button onPress={() => setValue(nextMonth)}>Next month</Button>
        </ButtonGroup>
      }
      // @ts-ignore
      value={value}
      weekdayStyle="short"
      onChange={setValue}
      onFocusChange={setValue}
    />
  );
}

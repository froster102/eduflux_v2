import { z } from "zod";
import { differenceInMinutes } from "date-fns";

import { convertToUTC } from "@/utils/date";

export const sessionFormSchema = z
  .object({
    selectedDate: z.string().refine((dateStr) => {
      const date = new Date(dateStr);

      return date instanceof Date && !isNaN(date.getTime());
    }, "Please select a valid date."),

    startTime: z
      .string()
      .nonempty("Start time is required.")
      .regex(
        /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
        "Invalid time format. Use HH:mm:ss.",
      ),

    endTime: z
      .string()
      .nonempty("End time is required.")
      .regex(
        /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
        "Invalid time format. Use HH:mm:ss.",
      ),

    studentId: z
      .string()
      .nonempty("Please select a student.")
      .uuid("Invalid student ID format."),
  })
  .refine(
    (data) => {
      const startDateTime = convertToUTC(
        data.selectedDate.split("T")[0],
        data.startTime,
      );

      return new Date() < new Date(startDateTime);
    },
    { message: "Start time should not be in the past", path: ["startTime"] },
  )
  .refine(
    (data) => {
      const startDateTime = convertToUTC(
        data.selectedDate.split("T")[0],
        data.startTime,
      );
      const endDateTime = convertToUTC(
        data.selectedDate.split("T")[0],
        data.endTime,
      );

      return endDateTime > startDateTime;
    },
    {
      message: "End time should be greater than start time",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      const startDateTime = convertToUTC(
        data.selectedDate.split("T")[0],
        data.startTime,
      );
      const endDateTime = convertToUTC(
        data.selectedDate.split("T")[0],
        data.endTime,
      );

      const minuteDifference = differenceInMinutes(endDateTime, startDateTime);

      return minuteDifference >= 30 && minuteDifference <= 60;
    },
    {
      message:
        "Session should be minimum of 30 minutes and a maximum of 1 hour",
      path: ["endTime"],
    },
  );

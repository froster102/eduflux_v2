import { parseTime } from "@internationalized/date";
import { z } from "zod/v4";

export const sessionPricingSchema = z.object({
  price: z
    .number({
      error: "Session price is required",
    })
    .min(0.01, "Session price must be greater than 0")
    .max(10000, "Session price cannot exceed 10,000"),
  currency: z.string().min(1, "Currency is required"),
  duration: z
    .number({
      error: "Session duration is required",
    })
    .min(15, "Session duration must be at least 15 minutes")
    .max(240, "Session duration cannot exceed 240 minutes (4 hours)"),
});

export type SessionPricingFormData = z.infer<typeof sessionPricingSchema>;

export const slotSchema = z
  .object({
    dayOfWeek: z.number(),
    enabled: z.boolean(),
    startTime: z.iso.time().optional(),
    endTime: z.iso.time().optional(),
  })
  .check((ctx) => {
    if (ctx.value.enabled) {
      if (!ctx.value.startTime) {
        ctx.issues.push({
          code: "custom",
          message: "Start time is required if day is selected.",
          input: ctx.value,
          path: ["startTime"],
        });
      }
      if (!ctx.value.endTime) {
        ctx.issues.push({
          code: "custom",
          input: ctx.value,
          message: "End time is required if day is selected.",
          path: ["endTime"],
        });
      }

      if (ctx.value.startTime && ctx.value.endTime) {
        const start =
          typeof ctx.value.startTime === "string"
            ? parseTime(ctx.value.startTime)
            : ctx.value.startTime;
        const end =
          typeof ctx.value.endTime === "string"
            ? parseTime(ctx.value.endTime)
            : ctx.value.endTime;

        if (end.compare(start) <= 0) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.endTime,
            message: "End time must be after start time.",
            path: ["endTime"],
          });

          return;
        }

        const minEndTimeRequired = start.add({ minutes: 60 });

        if (end.compare(minEndTimeRequired) < 0) {
          ctx.issues.push({
            code: "custom",
            input: ctx.value.endTime,
            message: "Availability must be at least 60 minutes long.",
            path: ["endTime"],
          });
        }
      }
    }
  });

export const availabilitySchema = z.object({
  weeklySchedule: z.array(slotSchema),
  applyForWeeks: z.number().min(1).max(12),
});

export type AvailabilityFormData = z.infer<typeof availabilitySchema>;
export type Slot = z.infer<typeof slotSchema>;

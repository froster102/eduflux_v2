import { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';
import { parseTime } from '@internationalized/date';
import { PaginationConfig } from '@shared/config/PaginationConfig';
import { isValidTimeZone } from '@shared/utils/date';
import { z } from 'zod/v4';

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
          code: 'custom',
          message: 'Start time is required if day is selected.',
          input: ctx.value,
          path: ['startTime'],
        });
      }
      if (!ctx.value.endTime) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          message: 'End time is required if day is selected.',
          path: ['endTime'],
        });
      }

      if (ctx.value.startTime && ctx.value.endTime) {
        const start =
          typeof ctx.value.startTime === 'string'
            ? parseTime(ctx.value.startTime)
            : ctx.value.startTime;
        const end =
          typeof ctx.value.endTime === 'string'
            ? parseTime(ctx.value.endTime)
            : ctx.value.endTime;

        if (end.compare(start) <= 0) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value.endTime,
            message: 'End time must be after start time.',
            path: ['endTime'],
          });

          return;
        }

        const minEndTimeRequired = start.add({ minutes: 60 });

        if (end.compare(minEndTimeRequired) < 0) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value.endTime,
            message: 'Availability must be at least 60 minutes long.',
            path: ['endTime'],
          });
        }
      }
    }
  });

export const enableSessionsSchema = z.object({
  price: z.number(),
  weeklySchedules: z.array(slotSchema),
  applyForWeeks: z.number().min(1).max(12),
  timeZone: z.string().refine(
    (val) => {
      return isValidTimeZone(val);
    },
    { error: 'Invalid timezone.' },
  ),
});

export const updateSessionSettingsSchema = enableSessionsSchema.partial();

export const bookingSchema = z.object({
  slotId: z.string({ error: 'Slot id is required' }),
});

export const dateSchema = z.object({
  filter: z.object({
    date: z.iso.datetime({ error: 'Invalid date.', local: true }),
    timeZone: z.string().refine(
      (val) => {
        return isValidTimeZone(val);
      },
      { error: 'Invalid timezone.' },
    ),
  }),
});

export const sessionFiltersSchema = z
  .object({
    status: z.enum(SessionStatus),
  })
  .optional();

export const sessionQueryParametersSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(PaginationConfig.defaultPageSize),
  filters: sessionFiltersSchema,
  type: z.enum(['learner', 'instructor']).default('learner'),
});

export const joinSessionSchema = z.object({
  sessionId: z.string({ error: 'Session id is required' }),
});

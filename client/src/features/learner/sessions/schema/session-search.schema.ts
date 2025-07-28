import { z } from "zod/v4";

export const sessionSearchSchema = z.object({
  success: z.boolean().optional(),
  sessionId: z.string().optional(),
  instructor: z.string().optional(),
  user: z.string().optional(),
  startTime: z.iso.datetime().optional(),
  endTime: z.iso.datetime().optional(),
});

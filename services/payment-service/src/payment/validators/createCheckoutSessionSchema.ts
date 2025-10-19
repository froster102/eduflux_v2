import { z } from 'zod/v4';

export const createCheckoutSchema = z.object({
  type: z.enum(['course', 'session']),
});

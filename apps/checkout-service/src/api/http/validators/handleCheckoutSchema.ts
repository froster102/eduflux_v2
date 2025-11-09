import { z } from 'zod/v4';

export const handleCheckoutSchema = z.object({
  item: z.object({
    itemType: z.enum(['course', 'session']),
    itemId: z.string(),
  }),
});

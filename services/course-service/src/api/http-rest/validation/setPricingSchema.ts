import z from 'zod/v4';

export const setPricingSchema = z.object({
  price: z.number().min(0, { error: 'Price cannot be negative' }),
  isFree: z.boolean(),
});

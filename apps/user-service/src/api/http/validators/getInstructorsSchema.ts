import { paginationSchema } from '@api/http/validators/paginationSchema';
import z from 'zod/v4';

export const getInstructorsFilterSchema = z.object({
  filter: z.object({
    isSchedulingEnabled: z.coerce.boolean(),
    name: z.string().optional(),
  }),
});
export const getInstructorsSchema = z.object({
  ...paginationSchema.shape,
  ...getInstructorsFilterSchema.shape,
});

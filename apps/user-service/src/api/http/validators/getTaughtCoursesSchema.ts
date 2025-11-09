import { paginationSchema } from '@api/http/validators/paginationSchema';
import z from 'zod/v4';

export const getTaughtCourseSchema = z.object({
  ...paginationSchema.shape,
});

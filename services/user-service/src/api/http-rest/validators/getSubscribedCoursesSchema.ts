import { paginationSchema } from '@api/http-rest/validators/paginationSchema';
import z from 'zod/v4';

export const getSubscribedCoursesSchema = z.object({
  ...paginationSchema.shape,
});

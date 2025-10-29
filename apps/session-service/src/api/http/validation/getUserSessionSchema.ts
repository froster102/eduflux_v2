import { paginationSchema } from '@api/http/validation/paginationSchema';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { z } from 'zod/v4';

export const userSessionFilterSchema = z.object({
  filter: z.object({
    preferedRole: z.enum([Role.INSTRUCTOR, Role.LEARNER]).default(Role.LEARNER),
  }),
});

export const getUserSessionSchema = z.object({
  ...paginationSchema.shape,
  ...userSessionFilterSchema.shape,
});

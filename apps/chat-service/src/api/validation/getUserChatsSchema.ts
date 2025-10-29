import { paginationSchema } from '@api/validation/paginationSchema';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { z } from 'zod/v4';

const getUserChatsFilter = z.object({
  filter: z.object({
    role: z
      .enum([Role.INSTRUCTOR, Role.LEARNER])
      .optional()
      .default(Role.LEARNER),
  }),
});

export const getUserChatsSchema = z.object({
  ...getUserChatsFilter.shape,
  ...paginationSchema.shape,
});

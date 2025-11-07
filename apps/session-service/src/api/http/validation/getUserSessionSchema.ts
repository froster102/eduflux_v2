import { paginationSchema } from '@api/http/validation/paginationSchema';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';
import { SortOrder } from '@eduflux-v2/shared/constants/SortOrder';
import { z } from 'zod/v4';

export const userSessionFilterSchema = z.object({
  filter: z.object({
    preferedRole: z.enum([Role.INSTRUCTOR, Role.LEARNER]).default(Role.LEARNER),
    status: z.enum(SessionStatus).optional(),
    search: z.string().optional(),
    sort: z
      .string()
      .optional()
      .transform((sortStr) => {
        if (!sortStr) return {};
        const fields = sortStr.split(',');
        const sortObj: Record<string, SortOrder> = {};
        fields.forEach((field) => {
          const key = field.replace(/^-/, '');
          const order = field.startsWith('-') ? SortOrder.DSC : SortOrder.ASC;
          sortObj[key] = order;
        });
        return sortObj;
      })
      .optional(),
  }),
});

export const getUserSessionSchema = z.object({
  ...paginationSchema.shape,
  ...userSessionFilterSchema.shape,
});

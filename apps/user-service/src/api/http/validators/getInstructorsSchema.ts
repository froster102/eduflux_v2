import { paginationSchema } from '@api/http/validators/paginationSchema';
import { SortOrder } from '@eduflux-v2/shared/constants/SortOrder';
import z from 'zod/v4';

export const getInstructorsFilterSchema = z.object({
  filter: z.object({
    isSchedulingEnabled: z.coerce.boolean(),
    name: z.string().optional(),
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
export const getInstructorsSchema = z.object({
  ...paginationSchema.shape,
  ...getInstructorsFilterSchema.shape,
});

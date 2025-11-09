import { paginationSchema } from '@api/http/validators/paginationSchema';
import { SortOrder } from '@core/domain/common/enum/SortOrder';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import z from 'zod/v4';

const courseFilterSchema = z
  .object({
    filter: z.object({
      status: z.enum(Object.values(CourseStatus)).optional(),
      catergory: z.string().optional(),
      instructor: z.string().optional(),
    }),
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
      }),
  })
  .partial();

export const getCoursesSchema = z.object({
  ...paginationSchema.shape,
  ...courseFilterSchema.shape,
});

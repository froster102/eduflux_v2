import { paginationSchema } from '@api/http-rest/validation/paginationSchema';
import { SortOrder } from '@core/common/enums/SortOrder';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import z from 'zod/v4';

const courseFilterSchema = z
  .object({
    filters: z.object({
      status: z.enum(Object.values(CourseStatus)),
      catergory: z.string(),
      instructor: z.string(),
    }),
    sort: z.object({
      price: z.enum(Object.values(SortOrder)),
    }),
  })
  .partial();

export const getCoursesSchema = z.object({
  ...paginationSchema.shape,
  ...courseFilterSchema.shape,
});

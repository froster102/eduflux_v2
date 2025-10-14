import { CourseLevel } from '@core/domain/course/enum/CourseLevel';
import { contentLimits } from '@shared/config/content-limits.config';
import z from 'zod/v4';

export const updateCourseSchema = z
  .object({
    title: z
      .string()
      .min(contentLimits.COURSE_TITLE.MIN_LENGTH, {
        error: `Title should be at least ${contentLimits.COURSE_TITLE.MIN_LENGTH} character`,
      })
      .max(contentLimits.COURSE_TITLE.MAX_LENGTH, {
        error: `Title cannot exceed ${contentLimits.COURSE_TITLE.MAX_LENGTH} characters`,
      })
      .regex(contentLimits.NO_LEADING_SPECIAL_CHAR_REGEX, {
        error: 'Title cannot start with a special character or space',
      }),
    description: z.string().min(contentLimits.COURSE_DESCRIPTION.MIN_LENGTH, {
      error: `Description must be at least ${contentLimits.COURSE_DESCRIPTION.MIN_LENGTH} characters`,
    }),
    categoryId: z.string({ error: 'A valid category ID is required' }),
    thumbnail: z.string({ error: 'Thumbnail is required' }),
    level: z.enum(Object.values(CourseLevel)),
    price: z
      .number({ error: 'Course pricing is required' })
      .min(contentLimits.MIN_COURSE_PRICE)
      .max(contentLimits.MAX_COURSE_PRICE),
    isFree: z.boolean(),
  })
  .partial();

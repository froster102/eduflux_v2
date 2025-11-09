import { contentLimits } from '@shared/config/content-limits.config';
import z from 'zod/v4';

export const createCourseSchema = z.object({
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
  categoryId: z.string({ error: 'A valid category ID is required' }),
});

import { contentLimits } from '@shared/config/content-limits.config';
import z from 'zod/v4';

export const createLectureSchema = z.object({
  title: z
    .string()
    .min(contentLimits.LECTURE_TITLE.MIN_LENGTH, {
      error: `Title should be at least ${contentLimits.LECTURE_TITLE.MIN_LENGTH} character`,
    })
    .max(contentLimits.LECTURE_TITLE.MAX_LENGTH, {
      error: `Title cannot exceed ${contentLimits.LECTURE_TITLE.MAX_LENGTH} characters`,
    })
    .regex(contentLimits.NO_LEADING_SPECIAL_CHAR_REGEX, {
      error: 'Title cannot start with a special character or space',
    }),

  description: z.string().max(contentLimits.LECTURE_DESCRIPTION.MAX_LENGTH, {
    error: `Description must be at least ${contentLimits.LECTURE_DESCRIPTION.MAX_LENGTH} characters`,
  }),
  preview: z.boolean(),
});

import { contentLimits } from '@shared/config/content-limits.config';
import z from 'zod/v4';

export const createChapterSchema = z.object({
  title: z
    .string()
    .min(contentLimits.CHAPTER_TITLE.MIN_LENGTH, {
      error: `Title should be at least ${contentLimits.CHAPTER_TITLE.MIN_LENGTH} character`,
    })
    .max(contentLimits.CHAPTER_TITLE.MAX_LENGTH, {
      error: `Title cannot exceed ${contentLimits.CHAPTER_TITLE.MAX_LENGTH} characters`,
    })
    .regex(contentLimits.NO_LEADING_SPECIAL_CHAR_REGEX, {
      error: 'Title cannot start with a special character or space',
    }),

  description: z
    .string()
    .min(contentLimits.CHAPTER_DESCRIPTION.MIN_LENGTH)
    .max(contentLimits.CHAPTER_DESCRIPTION.MAX_LENGTH, {
      error: `Description must be at least ${contentLimits.CHAPTER_DESCRIPTION.MIN_LENGTH} characters`,
    }),
});

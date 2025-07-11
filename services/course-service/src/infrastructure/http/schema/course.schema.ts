import { contentLimits } from '@/shared/config/content-limits.config';
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
      error: `Description must be at least ${contentLimits.CHAPTER_DESCRIPTION.MAX_LENGTH} characters`,
    }),
    categoryId: z.string({ error: 'A valid category ID is required' }),
    thumbnail: z.string({ error: 'Thumbnail is required' }),
    level: z.enum(contentLimits.COURSE_LEVELS),
    price: z.number({ error: 'Course pricing is required' }),
    isFree: z.boolean(),
  })
  .partial();

export const getCourseParams = z.object({
  id: z.uuid({ error: 'Invalid course id' }),
});

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

  description: z.string().max(contentLimits.CHAPTER_DESCRIPTION.MAX_LENGTH, {
    error: `Description must be at least ${contentLimits.CHAPTER_DESCRIPTION.MAX_LENGTH} characters`,
  }),
});

export const updateChapterSchema = createChapterSchema.partial();

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

export const updateLessonSchema = createLectureSchema.partial();

export const getUploadUrlSchema = z.object({
  resourceType: z.enum(contentLimits.RESOURCE_TYPES, {
    error: `Resource type should be either ${contentLimits.RESOURCE_TYPES.join(',')}`,
  }),
});

export const addAssetToLectureSchema = z.object({
  key: z.string(),
  fileName: z.string(),
  resourceType: z.enum(contentLimits.RESOURCE_TYPES),
  uuid: z.uuidv4(),
});

export const rejectCourseSchema = z.object({
  feedback: z.string().min(contentLimits.COURSE_FEEDBACK.MIN_LENGTH, {
    error: `Feedback must be at least ${contentLimits.COURSE_FEEDBACK.MIN_LENGTH} characters`,
  }),
});

export const reorderCurriculumSchema = z.object({
  items: z.array(
    z.object({
      class: z.enum(contentLimits.CURRICULUM_CLASS_TYPES),
      id: z.string(),
    }),
  ),
});

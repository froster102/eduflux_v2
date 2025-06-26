import z from 'zod/v4';

const titleMinLength = 5;
const titleMaxLength = 100;
const descriptionMinLength = 20;
const courseLevelEnum: ('beginner' | 'intermediate' | 'advanced')[] = [
  'beginner',
  'intermediate',
  'advanced',
];
const rejectionFeedbackMinLength = 20;
const noLeadingSpecialCharRegex = /^[a-zA-Z0-9].*/;
const resourceTypeEnum = ['image', 'video', 'raw'];
const classEnum = ['chapter', 'lecture'];

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(titleMinLength, {
      error: `Title should be at least ${titleMinLength} character`,
    })
    .max(titleMaxLength, {
      error: `Title cannot exceed ${titleMaxLength} characters`,
    })
    .regex(noLeadingSpecialCharRegex, {
      error: 'Title cannot start with a special character or space',
    }),
  categoryId: z.string({ error: 'A valid category ID is required' }),
});

export const updateCourseSchema = z
  .object({
    title: z
      .string()
      .min(titleMinLength, {
        error: `Title should be at least ${titleMinLength} character`,
      })
      .max(titleMaxLength, {
        error: `Title cannot exceed ${titleMaxLength} characters`,
      })
      .regex(noLeadingSpecialCharRegex, {
        error: 'Title cannot start with a special character or space',
      }),
    description: z.string().min(descriptionMinLength, {
      error: `Description must be at least ${descriptionMinLength} characters`,
    }),
    categoryId: z.string({ error: 'A valid category ID is required' }),
    thumbanil: z.string({ error: 'Thumbail is required' }),
    level: z.enum(courseLevelEnum),
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
    .min(titleMinLength, {
      error: `Title should be at least ${titleMinLength} character`,
    })
    .max(titleMaxLength, {
      error: `Title cannot exceed ${titleMaxLength} characters`,
    })
    .regex(noLeadingSpecialCharRegex, {
      error: 'Title cannot start with a special character or space',
    }),

  description: z.string().min(descriptionMinLength, {
    error: `Description must be at least ${descriptionMinLength} characters`,
  }),
});

export const updateChapterSchema = z.object({
  title: z
    .string()
    .min(titleMinLength, {
      error: `Title should be at least ${titleMinLength} character`,
    })
    .max(titleMaxLength, {
      error: `Title cannot exceed ${titleMaxLength} characters`,
    })
    .regex(noLeadingSpecialCharRegex, {
      error: 'Title cannot start with a special character or space',
    })
    .optional(),

  description: z
    .string()
    .min(descriptionMinLength, {
      error: `Description must be at least ${descriptionMinLength} characters`,
    })
    .optional(),

  thumbnail: z.url().optional(),

  category: z.string().optional(),

  price: z.number().optional(),

  isFree: z.boolean().optional(),

  level: z.enum(courseLevelEnum).optional(),
});

export const addLessonSchema = z.object({
  title: z
    .string()
    .min(titleMinLength, {
      error: `Title should be at least ${titleMinLength} character`,
    })
    .max(titleMaxLength, {
      error: `Title cannot exceed ${titleMaxLength} characters`,
    })
    .regex(noLeadingSpecialCharRegex, {
      error: 'Title cannot start with a special character or space',
    }),

  description: z.string().min(descriptionMinLength, {
    error: `Description must be at least ${descriptionMinLength} characters`,
  }),
  preview: z.boolean(),
});

export const updateLessonSchema = addLessonSchema.partial();

export const getUploadUrlSchema = z.object({
  resourceType: z.enum(resourceTypeEnum, {
    error: `Resource type should be either ${resourceTypeEnum.join(',')}`,
  }),
});

export const addAssetToLectureSchema = z.object({
  assetId: z.string(),
});

export const rejectCourseSchema = z.object({
  feedback: z.string().min(rejectionFeedbackMinLength, {
    error: `Feedback must be at least ${rejectionFeedbackMinLength} characters`,
  }),
});

export const reorderCurriculumSchema = z.object({
  items: z.array(
    z.object({
      class: z.enum(classEnum),
      id: z.string(),
    }),
  ),
});

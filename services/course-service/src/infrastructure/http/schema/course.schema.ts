import z from 'zod/v4';

const titleMinLength = 5;
const titleMaxLength = 100;
const descriptionMinLength = 20;
const courseLevelEnum: Array<'beginner' | 'intermediate' | 'advanced'> = [
  'beginner',
  'intermediate',
  'advanced',
];
const rejectionFeedbackMinLength = 20;
const noLeadingSpecialCharRegex = /^[a-zA-Z0-9].*/;
const resourceTypeEnum = ['image', 'video', 'raw'];

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

  description: z.string().min(descriptionMinLength, {
    error: `Description must be at least ${descriptionMinLength} characters`,
  }),

  level: z.enum(courseLevelEnum, {
    error: `Level should be any of ${courseLevelEnum.join(',')}`,
  }),
});

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

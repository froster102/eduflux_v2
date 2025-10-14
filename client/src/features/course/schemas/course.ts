import { z } from "zod/v4";

import { contentLimits } from "@/config/content-limits";
import { CourseLevel } from "@/shared/enums/CourseLevel";

const titleMinLength = 5;
const titleMaxLength = 100;
const noLeadingSpecialCharRegex = /^[a-zA-Z0-9].*/;
const descriptionMinLength = 20;

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
      error: "Title cannot start with a special character or space",
    }),
  categoryId: z.string({ error: "A valid category ID is required" }),
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
        error: "Title cannot start with a special character or space",
      }),
    description: z.string().min(contentLimits.COURSE_DESCRIPTION.MIN_LENGTH, {
      error: `Description must be at least ${contentLimits.COURSE_DESCRIPTION.MIN_LENGTH} characters`,
    }),
    categoryId: z.string({ error: "A valid category ID is required" }),
    thumbnail: z.string({ error: "Thumbnail is required" }),
    level: z.enum(Object.values(CourseLevel)),
    price: z.number({ error: "Course pricing is required" }),
    isFree: z.boolean(),
  })
  .partial();

export const sectionSchema = z.object({
  title: z
    .string()
    .min(titleMinLength, {
      error: `Title should be at least ${titleMinLength} character`,
    })
    .max(titleMaxLength, {
      error: `Title cannot exceed ${titleMaxLength} characters`,
    })
    .regex(noLeadingSpecialCharRegex, {
      error: "Title cannot start with a special character or space",
    }),

  description: z.string().min(descriptionMinLength, {
    error: `Description must be at least ${descriptionMinLength} characters`,
  }),
});

// export const updateSectionSchema = createSectionSchema.partial();

export const lectureSchema = z.object({
  title: z
    .string()
    .min(titleMinLength, {
      error: `Title should be at least ${titleMinLength} character`,
    })
    .max(titleMaxLength, {
      error: `Title cannot exceed ${titleMaxLength} characters`,
    })
    .regex(noLeadingSpecialCharRegex, {
      error: "Title cannot start with a special character or space",
    }),

  description: z.string({ error: "Required" }).min(descriptionMinLength, {
    error: `Description must be at least ${descriptionMinLength} characters`,
  }),
  preview: z.boolean({ error: "Required" }),
});

// export const updateLessonSchema = createLectureSchema.partial();

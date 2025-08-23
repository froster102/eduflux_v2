import { z } from "zod/v4";

const titleMinLength = 5;
const titleMaxLength = 100;
const noLeadingSpecialCharRegex = /^[a-zA-Z0-9].*/;
const descriptionMinLength = 20;
const minPrice = 10;
const courseLevelEnum: ("beginner" | "intermediate" | "advanced")[] = [
  "beginner",
  "intermediate",
  "advanced",
];

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
      error: "Title cannot start with a special character or space",
    }),
  categoryId: z.string({ error: "A valid category ID is required" }),
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
        error: "Title cannot start with a special character or space",
      }),
    description: z.string().min(descriptionMinLength, {
      error: `Description must be at least ${descriptionMinLength} characters`,
    }),
    categoryId: z.string({ error: "A valid category ID is required" }),
    thumbnail: z.string({ error: "Thumbail is required" }).nullable(),
    level: z.enum(courseLevelEnum),
    price: z.coerce
      .number({ error: "Course pricing must be a number" })
      .min(minPrice, {
        error: `Price must be at least ${minPrice} dollar.`,
      }),
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

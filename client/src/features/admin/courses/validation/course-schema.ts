import { z } from "zod";

const MAX_THUMBNAIL_IMAGE_SIZE = 500 * 1024;

const validateDescription = (min: number) =>
  z
    .string()
    .trim()
    .regex(validDescriptionStart, {
      message: "Description must start with a letter or number",
    })
    .refine((value) => value.split(/\s+/).length >= min, {
      message: `Description should have at least ${min} words.`,
    });

const validTitleRegex = /^[A-Za-z0-9][A-Za-z0-9\s-_&.,!?()]*$/;
const validDescriptionStart = /^[A-Za-z0-9]/;

export const sectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Minimum of 3 characters are required" })
    .max(100, { message: "Title should not exceed 100 characters" })
    .regex(validTitleRegex, {
      message: "Section title must start with a letter or number",
    }),
  description: validateDescription(10),
});

// const resourceSchema = z.object({
//   resourceId: z.string().min(10, { message: "Resource is required" }),
//   type: z.enum(["video", "pdf", "url"]),
//   title: z
//     .string()
//     .trim()
//     .min(3, { message: "Minimum of 3 characters are required" })
//     .max(100, { message: "Title should not exceed 100 characters" })
//     .regex(validTitleRegex, {
//       message:
//         "Title must start with a letter or number and can include spaces, underscores, dashes, and punctuation",
//     }),
//   url: z.union([
//     z
//       .any()
//       .transform((value) => (value instanceof FileList ? value[0] : value))
//       .refine(
//         (file) => file instanceof File && file.type.startsWith("video/"),
//         "Only video files are allowed",
//       ),
//     z
//       .any()
//       .transform((value) => (value instanceof FileList ? value[0] : value))
//       .refine(
//         (file) => file instanceof File && file.type === "application/pdf",
//         "Only PDF files are allowed for PDF resources",
//       ),
//     z
//       .string()
//       .url({ message: "Invalid URL format" })
//       .refine(
//         (url) => url.startsWith("http://") || url.startsWith("https://"),
//         "URL must start with http:// or https://",
//       ),
//   ]),
// });

export const lessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Minimum of 3 characters are required" })
    .max(100, { message: "Title should not exceed 100 characters" })
    .regex(validTitleRegex, {
      message:
        "Chapter title must start with a letter or number and can include spaces, underscores, dashes, and punctuation",
    }),
  description: validateDescription(10),
  video: z.union([
    z
      .any()
      .transform((value) => (value instanceof FileList ? value[0] : value))
      .refine(
        (file) => file instanceof File && file.type.startsWith("video/"),
        "Only video files are allowed",
      ),
    z
      .any()
      .transform((value) => (value instanceof FileList ? value[0] : value))
      .refine(
        (file) => file instanceof File && file.type === "application/pdf",
        "Only PDF files are allowed for PDF resources",
      ),
    z
      .string()
      .url({ message: "Invalid URL format" })
      .refine(
        (url) => url.startsWith("http://") || url.startsWith("https://"),
        "URL must start with http:// or https://",
      ),
  ]),
  preview: z.boolean(),
});

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Minimum of 3 characters are required" })
    .max(100, { message: "Title should not exceed 100 characters" })
    .regex(validTitleRegex, {
      message: "Course title must start with a letter or number",
    }),
  description: validateDescription(10),
  thumbnail: z.union([
    z
      .any()
      .transform((value) => (value instanceof FileList ? value[0] : value))
      .refine(
        (file) =>
          file instanceof File &&
          new Set(["image/jpeg", "image/jpg", "image/png"]).has(file.type),
      )
      .refine(
        (file) => file instanceof File && file.size <= MAX_THUMBNAIL_IMAGE_SIZE,
        { message: "Image size must be less than or equal to 500KB" },
      ),
    z
      .string()
      .url({ message: "Invalid URL format" })
      .refine(
        (url) => url.startsWith("http://") || url.startsWith("https://"),
        "URL must start with http:// or https://",
      ),
  ]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  status: z.enum(["draft", "published"]),
});

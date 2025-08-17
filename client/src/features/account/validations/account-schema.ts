import { z } from "zod/v4";

import { CONTENT_LIMITS } from "@/config/content-limits";

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Required" }),
    newPassword: z
      .string()
      .min(6, "Must be minimum of 6 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/,
        "Must contain a letter,number,a special character",
      ),
    confirmNewPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password do not match",
    path: ["confirmNewPassword"],
  });

export const updateProfileSchema = z
  .object({
    firstName: z
      .string({ error: "Required" })
      .trim()
      .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
        message: "Please enter a valid name",
      }),
    lastName: z
      .string({ error: "Required" })
      .trim()
      .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
        message: "Avoid special characters, use spaces",
      }),
    bio: z.string().refine(
      (val) => {
        if (typeof val !== "string" || val.length === 0) {
          return true;
        }

        const words = val.split(" ");

        return (
          words.length >= CONTENT_LIMITS.BIO.MIN_LENGTH &&
          words.length <= CONTENT_LIMITS.BIO.MAX_LENGTH
        );
      },
      {
        error: `Bio words should be between ${CONTENT_LIMITS.BIO.MIN_LENGTH} and ${CONTENT_LIMITS.BIO.MAX_LENGTH} words`,
      },
    ),
    image: z.string(),
  })
  .partial();

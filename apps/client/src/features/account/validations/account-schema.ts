import { z } from "zod/v4";

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

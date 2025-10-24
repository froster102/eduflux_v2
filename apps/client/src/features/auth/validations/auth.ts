import { z } from "zod/v4";

export const resetPasswordFormSchema = z
  .object({
    otp: z.string().min(4, { message: "Enter a valid otp" }),
    newPassword: z
      .string()
      .min(6, "Must be minimum of 6 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/,
        "Must contain a letter,number,a special character",
      ),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, { error: "First name is required" })
    .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
      message: "Please enter a valid name",
    }),
  email: z.email({ error: "Please enter a valid email" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
});

export const signInSchema = z.object({
  email: z.email({ error: "Please enter a valid email" }),
  password: z.string().trim().min(1, { error: "Please enter your password" }),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Fullname is required" })
      .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
        message: "Please enter a valid name",
      }),
    email: z.email({ error: "Please enter a valid email" }),
    password: z
      .string()
      .min(6, "Must be minimum of 6 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/,
        "Must contain a letter,number,a special character",
      ),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

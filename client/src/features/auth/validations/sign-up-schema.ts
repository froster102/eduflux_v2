import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Fullname is required" })
      .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
        message: "Please enter a valid name",
      }),
    email: z
      .string()
      .trim()
      .min(0, { message: "Email is required" })
      .email({ message: "Please enter a valid email" }),
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

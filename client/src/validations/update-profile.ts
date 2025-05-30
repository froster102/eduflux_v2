import { z } from "zod";

export const updateProfileSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, { message: "First name is required" })
    .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
      message: "Please enter a valid name",
    }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),
});

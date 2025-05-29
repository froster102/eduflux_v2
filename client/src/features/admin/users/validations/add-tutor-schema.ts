import { z } from "zod";

export const createTutorSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, { message: "First name is required" })
    .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
      message: "Please enter a valid name",
    }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
      message: "Avoid special characters, use spaces",
    }),
  contactNumber: z
    .string()
    .trim()
    .min(0, { message: "Contact number is required" })
    .regex(/^[6789]\d{9}$/, { message: "Enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  // courses: z.array(z.string().uuid()),
});

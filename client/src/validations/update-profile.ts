import { z } from "zod";

import { statesOfIndia } from "@/utils/info";

export const updateProfileSchema = z.object({
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
    .min(1, { message: "Last name is required" })
    .regex(/^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/, {
      message: "Avoid special characters, use spaces",
    }),

  contactNumber: z
    .string()
    .trim()
    .min(10, { message: "Contact number must be at least 10 digits" })
    .regex(/^[6789]\d{9}$/, { message: "Enter a valid phone number" }),

  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),

  address: z
    .string()
    .refine(
      (address) => {
        const parts = address
          .split(",")
          .map((part) => part.trim().toLowerCase());

        if (parts.length !== 7) {
          return false;
        }

        const [houseNumber, houseName, street, city, district, pincode, state] =
          parts;

        if (!/^\d+$/.test(houseNumber)) {
          return false;
        }

        if (!/^[A-Za-z0-9\s]+$/.test(houseName)) {
          return false;
        }

        if (!/^[A-Za-z0-9\s#]+$/.test(street)) {
          return false;
        }

        if (!/^[A-Za-z\s]+$/.test(city)) {
          return false;
        }

        if (!/^[A-Za-z\s]+$/.test(district)) {
          return false;
        }

        // Validate pincode (should be exactly 6 digits)
        if (!/^\d{6}$/.test(pincode)) {
          return false;
        }

        // Validate state (only alphabetic and spaces)
        if (
          !/^[A-Za-z\s]+$/.test(state) ||
          !statesOfIndia.includes(state.toLowerCase())
        ) {
          return false;
        }

        return true;
      },
      {
        message:
          "Address should be in valid format: (house number),(house name),(street),(city),(district),(pincode),(state)",
      },
    )
    .transform((val, ctx) => {
      const parts = val.split(",");
      const errorMessages = [];

      const [houseNumber, houseName, street, city, district, pincode, state] =
        parts;

      // Specific error messages for each part
      if (!/^\d+$/.test(houseNumber)) {
        errorMessages.push("House number must be numeric.");
      }
      if (!/^[A-Za-z0-9\s]+$/.test(houseName)) {
        errorMessages.push(
          "House name can only contain alphanumeric characters and spaces.",
        );
      }
      if (!/^[A-Za-z0-9\s#]+$/.test(street)) {
        errorMessages.push(
          "Street name can contain alphanumeric characters, spaces, and common street symbols.",
        );
      }
      if (!/^[A-Za-z\s]+$/.test(city)) {
        errorMessages.push(
          "City name should only contain alphabetic characters and spaces.",
        );
      }
      if (!/^[A-Za-z\s]+$/.test(district)) {
        errorMessages.push("District name should be valid");
      }
      if (!/^\d{6}$/.test(pincode)) {
        errorMessages.push("Pincode must be exactly 6 digits.");
      }
      if (!/^[A-Za-z\s]+$/.test(state)) {
        errorMessages.push(
          "State name should only contain alphabetic characters and spaces.",
        );
      }

      if (errorMessages.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errorMessages.join(" "),
        });
      }

      return val;
    })
    .optional(),
});

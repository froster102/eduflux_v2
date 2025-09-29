import { paginationSchema } from "@api/http-rest/validation/paginationSchema";
import { z } from "zod/v4";

export const getInstructorViewSchema = z.object({
  ...paginationSchema.shape,
});

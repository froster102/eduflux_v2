import { PaginationConfig } from "@shared/config/PaginationConfig";
import { z } from "zod/v4";

export const paginationSchema = z.object({
  page: z.object({
    number: z.coerce.number().default(1),
    size: z.coerce.number().default(PaginationConfig.DefaultPageSize),
  }),
});

import { PaginationConfig } from "@shared/config/PaginationConfig";
import { z } from "zod/v4";

export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(PaginationConfig.DefaultPageSize),
});

import z from 'zod/v4';

export const paginationQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    searchQuery: z.string().optional(),
    searchFields: z
      .string()
      .optional()
      .transform((s) => (s ? s.split(',') : undefined))
      .optional(),
    filters: z
      .record(
        z.string(),
        z.union([
          z.string(),
          z.number(),
          z.boolean(),
          z.array(z.string()),
          z.array(z.number()),
        ]),
      )
      .optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .partial();

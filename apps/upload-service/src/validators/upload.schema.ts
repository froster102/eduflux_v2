import { z } from 'zod/v4';

const resoucseTypeEnum = z.enum(['image', 'raw', 'video', 'auto']);

export const uploadSchema = z.object({
  fileName: z.string(),
  resourceType: resoucseTypeEnum,
});

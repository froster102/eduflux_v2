import { contentLimits } from '@shared/config/content-limits.config';
import z from 'zod/v4';

export const getUploadUrlSchema = z.object({
  resourceType: z.enum(contentLimits.RESOURCE_TYPES, {
    error: `Resource type should be either ${contentLimits.RESOURCE_TYPES.join(',')}`,
  }),
});

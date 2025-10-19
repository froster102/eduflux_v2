import { contentLimits } from '@shared/config/content-limits.config';
import z from 'zod/v4';

export const reorderCurriculumSchema = z.object({
  items: z.array(
    z.object({
      class: z.enum(contentLimits.CURRICULUM_CLASS_TYPES),
      id: z.string(),
    }),
  ),
});

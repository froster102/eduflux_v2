import { createChapterSchema } from '@api/http/validators/createChapterSchema';

export const updateChapterSchema = createChapterSchema.partial();

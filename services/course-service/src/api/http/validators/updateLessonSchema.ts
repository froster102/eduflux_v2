import { createLectureSchema } from '@api/http/validators/createLectureSchema';

export const updateLessonSchema = createLectureSchema.partial();

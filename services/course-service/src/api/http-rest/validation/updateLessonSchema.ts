import { createLectureSchema } from '@api/http-rest/validation/createLectureSchema';

export const updateLessonSchema = createLectureSchema.partial();

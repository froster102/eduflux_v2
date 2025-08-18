import type { AddLessonDto } from './add-lesson.dto';

export type UpdateLessonDto = Partial<AddLessonDto> & {
  courseId: string;
  lessonId: string;
  sectionId: string;
};

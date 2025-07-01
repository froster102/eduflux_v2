import api from "@/lib/axios";

interface LessonCompletionParams {
  userId: string;
  courseId: string;
  sectionId: string;
  lessonId: string;
}

export async function getCourseProgress(courseId: string): Promise<Progress> {
  const response = await api.get<Progress>(`progress/courses/${courseId}`);

  return response.data;
}

export async function markLessonAsComplete({
  courseId,
  sectionId,
  lessonId,
}: LessonCompletionParams): Promise<Progress> {
  const response = await api.patch<Progress>(
    `/progress/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/mark-complete`,
  );

  return response.data;
}

export async function unmarkLessonAsComplete({
  courseId,
  sectionId,
  lessonId,
}: LessonCompletionParams): Promise<Progress> {
  const response = await api.patch<Progress>(
    `/progress/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/unmark-complete`,
  );

  return response.data;
}

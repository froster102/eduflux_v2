import api from "@/lib/axios";

export async function getCourseProgress(
  courseId: string,
): Promise<JsonApiResponse<CourseProgress>> {
  const response = await api.get(
    `/users/me/subscribed-courses/${courseId}/progress`,
  );

  return response.data;
}

export async function addCourseProgress(data: {
  courseId: string;
  lectureId: string;
}): Promise<void> {
  await api.post(
    `/users/me/subscribed-courses/${data.courseId}/completed-lectures/`,
    { lectureId: data.lectureId },
  );

  return;
}

export async function deleteCourseProgress(data: {
  courseId: string;
  lectureId: string;
}) {
  await api.delete(
    `/users/me/subscribed-courses/${data.courseId}/completed-lectures/${data.lectureId}`,
  );

  return;
}

import api from "@/lib/axios";

export async function enrollForCourse(
  courseId: string,
): Promise<JsonApiResponse<EnrollForCourseResponse>> {
  const response = await api.post(`/enrollments`, {
    courseId,
  });

  return response.data;
}

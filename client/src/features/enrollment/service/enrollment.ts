import api from "@/lib/axios";

export async function enrollForCourse(
  courseId: string,
): Promise<EnrollForCourseResponse> {
  const response = await api.post(`/enrollments`, {
    courseId,
  });

  return response.data;
}

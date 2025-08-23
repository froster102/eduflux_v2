import api from "@/lib/axios";

export async function checkUserEnrollment(
  courseId: string,
): Promise<{ isEnrolled: boolean }> {
  const response = await api.get(
    `/enrollments/check-enrollment?courseId=${courseId}`,
  );

  return response.data;
}

export async function enrollForCourse(
  courseId: string,
): Promise<{ checkoutUrl: string }> {
  const response = await api.post(`/enrollments/`, { courseId });

  return response.data;
}

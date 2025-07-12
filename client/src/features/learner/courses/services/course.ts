import api from "@/lib/axios";
import { buildQueryUrlParams } from "@/utils/url";

export async function getCourses(
  paginationQueryParams: PaginationQueryParams,
): Promise<{
  courses: Course[];
  total: number;
}> {
  const params = buildQueryUrlParams(paginationQueryParams);

  const response = await api.get(`/courses${params}`);

  return response.data;
}

export async function getCourseInfo(courseId: string): Promise<Course> {
  const response = await api.get(`/courses/${courseId}`);

  return response.data;
}

export async function getCourseCurriculum(
  courseId: string,
): Promise<CurriculumItems> {
  const response = await api.get(`/courses/${courseId}/curriculum`);

  return response.data;
}

export async function enrollForCourse(
  courseId: string,
): Promise<{ checkoutUrl: string }> {
  const response = await api.post(`/enrollments/`, { courseId });

  return response.data;
}

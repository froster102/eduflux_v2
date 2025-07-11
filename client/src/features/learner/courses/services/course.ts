import api from "@/lib/axios";
import { buildQueryUrlParams } from "@/utils/url";

export async function getPublishedCourses(
  paginationQueryParams: PaginationQueryParams,
): Promise<{
  courses: Course[];
  total: number;
}> {
  const params = buildQueryUrlParams(paginationQueryParams);

  const response = await api.get(`/courses/published-courses${params}`);

  return response.data;
}

export async function getPublishedCourseInfo(
  courseId: string,
): Promise<Course> {
  const response = await api.get(`/courses/published-courses/${courseId}`);

  return response.data;
}

export async function getPublishedCourseCurriculum(
  courseId: string,
): Promise<CurriculumItems> {
  const response = await api.get(
    `/courses/published-courses/${courseId}/curriculum`,
  );

  return response.data;
}

export async function enrollForCourse(
  courseId: string,
): Promise<{ checkoutUrl: string }> {
  const response = await api.post(`/enrollments/`, { courseId });

  return response.data;
}

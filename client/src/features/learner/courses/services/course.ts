import api from "@/lib/axios";
import { buildQueryUrlParams } from "@/utils/helpers";

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

export async function getSubscribedCourses(
  paginationQueryParams: PaginationQueryParams,
): Promise<{ total: number; courses: Course[] }> {
  const queryParams = buildQueryUrlParams(paginationQueryParams);
  const response = await api.get(
    `/courses/me/subscribed-courses${queryParams}`,
  );

  return response.data;
}

export async function checkUserEnrollment(
  courseId: string,
): Promise<{ isEnrolled: boolean }> {
  const response = await api.get(
    `/enrollments/check-enrollment?courseId=${courseId}`,
  );

  return response.data;
}

export async function getLecture(data: {
  lectureId: string;
  courseId: string;
}): Promise<Lecture> {
  const response = await api.get(
    `/courses/me/subscribed-courses/${data.courseId}/lectures/${data.lectureId}`,
  );

  return response.data;
}

export async function getCourseProgress(
  courseId: string,
): Promise<CourseProgress> {
  const response = await api.get(
    `/users/me/subscribed-courses/${courseId}/progress`,
  );

  return response.data;
}

export async function addCourseLectureProgress(data: {
  courseId: string;
  lectureId: string;
}): Promise<void> {
  await api.post(
    `/users/me/subscribed-courses/${data.courseId}/completed-lectures/`,
    { lectureId: data.lectureId },
  );

  return;
}

export async function deleteCourseLectureProgress(data: {
  courseId: string;
  lectureId: string;
}) {
  await api.delete(
    `/users/me/subscribed-courses/${data.courseId}/completed-lectures/${data.lectureId}`,
  );

  return;
}

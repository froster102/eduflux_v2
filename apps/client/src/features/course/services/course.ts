import api from '@/lib/axios';
import { buildJsonApiQueryString } from '@/utils/helpers';

export async function getInstructorCourses(
  paginationQueryParams: PaginationQueryParameters,
): Promise<GetInstructorCoursesResponse> {
  const params = buildJsonApiQueryString(paginationQueryParams);

  const response = await api.get<GetInstructorCoursesResponse>(
    `/users/me/taught-courses${params}`,
  );

  return response.data;
}

export async function getInstructorCourseCurriculum(
  courseId: string,
): Promise<GetInstructorCourseCurriculumReponse> {
  const response = await api.get<GetInstructorCourseCurriculumReponse>(
    `courses/${courseId}/instructor-curriculum`,
  );

  return response.data;
}

export async function updateCurriculumItems({
  courseId,
  items,
}: {
  courseId: string;
  items: { id: string; class: string }[];
}): Promise<void> {
  const response = await api.put(`/courses/${courseId}/instructor-curriculum`, {
    items,
  });

  return response.data;
}

export async function getCourseCategories(): Promise<GetCourseCategories> {
  const response = await api.get(`/courses/course-categories`);

  return response.data;
}

export async function createCourse(data: CreateCourseFormData) {
  const response = await api.post('/courses/', data);

  return response.data;
}

export async function createChapter(
  data: ChapterFormData & { courseId: string },
) {
  const response = await api.post(`/courses/${data.courseId}/chapters`, data);

  return response.data;
}

export async function updateChapter(
  data: ChapterFormData & { courseId: string; chapterId: string },
) {
  const response = await api.put(
    `/courses/${data.courseId}/chapters/${data.chapterId}`,
    data,
  );

  return response.data;
}

export async function deleteChapter(data: {
  courseId: string;
  chapterId: string;
}) {
  const response = await api.delete(
    `/courses/${data.courseId}/chapters/${data.chapterId}`,
  );

  return response.data;
}

export async function createLecture(
  data: LectureFormData & { courseId: string },
): Promise<JsonApiResponse<Lecture>> {
  const response = await api.post<JsonApiResponse<Lecture>>(
    `/courses/${data.courseId}/lectures`,
    data,
  );

  return response.data;
}

export async function updateLecture(
  data: LectureFormData & { courseId: string; lectureId: string },
) {
  const response = await api.put(
    `/courses/${data.courseId}/lectures/${data.lectureId}`,
    data,
  );

  return response.data;
}

export async function deleteLecture(data: {
  courseId: string;
  lectureId: string;
}) {
  const response = await api.delete(
    `/courses/${data.courseId}/lectures/${data.lectureId}`,
  );

  return response.data;
}

export async function getCourseInfo(
  courseId: string,
): Promise<JsonApiResponse<Course>> {
  const response = await api.get(`/courses/${courseId}`);

  return response.data;
}

export async function updateCourse(data: {
  id: string;
  updateData: UpdateCourseFormData;
}) {
  const response = await api.put(`/courses/${data.id}`, data.updateData);

  return response.data;
}

export async function addAssetToLecture(data: {
  key: string;
  uuid: string;
  fileName: string;
  courseId: string;
  lectureId: string;
  resourceType: 'image' | 'video';
}) {
  const response = await api.post(
    `/courses/${data.courseId}/lectures/${data.lectureId}/assets`,
    data,
  );

  return response.data;
}

export async function publishCourse(courseId: string) {
  const response = await api.post(`/courses/${courseId}/publish`);

  return response.data;
}

export async function getCourses(
  paginationQueryParams: PaginationQueryParameters,
): Promise<GetCoursesResponse> {
  const params = buildJsonApiQueryString(paginationQueryParams);

  const response = await api.get(`/courses${params}`);

  return response.data;
}

export async function getCourseCurriculum(
  courseId: string,
): Promise<JsonApiResponse<CurriculumItems>> {
  const response = await api.get<JsonApiResponse<CurriculumItems>>(
    `/courses/${courseId}/curriculum`,
  );

  return response.data;
}

export async function getSubscribedCourses(
  paginationQueryParams: GetSubscribedCoursesQueryParams,
): Promise<GetSubscribedCourses> {
  const queryParams = buildJsonApiQueryString(paginationQueryParams);
  const response = await api.get<GetSubscribedCourses>(
    `/users/me/subscribed-courses${queryParams}`,
  );

  return response.data;
}

export async function getLecture(data: {
  lectureId: string;
  courseId: string;
}): Promise<JsonApiResponse<Lecture>> {
  const response = await api.get<JsonApiResponse<Lecture>>(
    `/courses/${data.courseId}/lectures/${data.lectureId}`,
  );

  return response.data;
}

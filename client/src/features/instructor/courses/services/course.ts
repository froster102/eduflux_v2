import api from "@/lib/axios";
import { buildQueryUrlParams } from "@/utils/url";

export async function getInstructorCourses(
  paginationQueryParams: PaginationQueryParams,
): Promise<{ courses: Course[]; total: number }> {
  const params = buildQueryUrlParams(paginationQueryParams);

  const response = await api.get(`/users/me/taught-courses${params}`);

  return response.data;
}

export async function getInstructorCourseCurriculum(
  courseId: string,
): Promise<{ data: CurriculumItems }> {
  const response = await api.get(`courses/${courseId}/instructor-curriculum`);

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

export async function getCourseCategories(): Promise<{
  categories: { id: string; title: string }[];
}> {
  const response = await api.get(`/courses/course-categories`);

  return response.data;
}

export async function createCourse(data: CreateCourseFormData) {
  const response = await api.post("/courses/", data);

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
): Promise<Lecture> {
  const response = await api.post(`/courses/${data.courseId}/lectures`, data);

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

export async function getCourseInfo(courseId: string): Promise<Course> {
  const response = await api.get(`/courses/${courseId}`);

  return response.data;
}

export async function updateCourseInfo(data: {
  id: string;
  updateData: UpdateCourseFormData;
}) {
  const response = await api.put(`/courses/${data.id}`, data.updateData);

  return response.data;
}

export async function getUploadCredentials(data: {
  fileName: string;
  resourceType: "image" | "video";
}): Promise<UploadCredentials> {
  const response = await api.post(`uploads/get-upload-credentials`, data);

  return response.data;
}

export async function addAssetToLecture(data: {
  key: string;
  uuid: string;
  fileName: string;
  courseId: string;
  lectureId: string;
  resourceType: "image" | "video";
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

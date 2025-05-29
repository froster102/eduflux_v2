import api from "@/lib/axios";

export async function getAllCourses(queryParams: QueryParams) {
  const { page, pageSize, searchKey, searchQuery } = queryParams;
  const params: Record<string, any> = {
    searchQuery,
    page,
    pageSize,
    searchKey,
  };

  Object.keys(queryParams).forEach((key) =>
    params[key] === "undefined" || params[key] === null
      ? delete params[key]
      : {},
  );

  return await api.get<{
    courses: Course[];
    total: number;
  }>("/courses", { params });
}

export async function getCourseById(courseId: string) {
  return api.get<Course>(`/courses/${courseId}`);
}

export async function updateCourse(updatedCourseData: Course) {
  return api.put<Course>(`/courses/${updatedCourseData.id}`, updatedCourseData);
}

export async function addCourse(
  course: Omit<Course, "id" | "createdBy" | "processing">,
) {
  return api.post<Course>(`/courses/`, course);
}

export async function deleteCourse(courseId: string) {
  return api.delete<Course>(`/courses/${courseId}`);
}

export async function getCoursesByIds(
  courseIds: string[],
  queryParams: QueryParams,
) {
  const { page, pageSize, searchKey, searchQuery } = queryParams;
  const params: Record<string, any> = {
    ids: courseIds.join(","),
    searchQuery,
    page,
    pageSize,
    searchKey,
  };

  Object.keys(params).forEach((key) => {
    if (params[key] === undefined || params[key] === null) {
      delete params[key];
    }
  });

  return api.get<{
    courses: Course[];
    total: number;
  }>("/courses/by-ids", { params });
}

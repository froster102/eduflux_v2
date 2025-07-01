import api from "@/lib/axios";

export function getAllAvailableCourse(queryParams?: QueryParams) {
  let params: Record<string, any> = {};

  if (queryParams) {
    const { page, pageSize, searchKey, searchQuery } = queryParams;

    params = {
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
  }

  return api.get<{ courses: Course[]; total: number }>(
    "/courses/available-courses",
    {
      params,
    },
  );
}

export function enrollForCourse(courseId: string) {
  return api.post("/enrollments", { courseId });
}

export function getAllStudentEnrollments(studentId: string) {
  return api.get<{ enrollments: Enrollment[] }>(
    `/students/${studentId}/enrollments/`,
  );
}

export function getEnrolledCourse(studentId: string, courseId: string) {
  return api.get<Course>(`/students/${studentId}/enrolled-courses/${courseId}`);
}

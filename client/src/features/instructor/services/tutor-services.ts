import { CreateSessionData } from "../types/types";

import api from "@/lib/axios";

export function getTutorDetails(tutorId: string) {
  return api.get<User>(`/users/${tutorId}`);
}

export function getEnrolledStudents(queryParams: QueryParams) {
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

  return api.get<{ totalCount: number; students: Student[] }>(
    `/tutors/get-students`,
    { params },
  );
}

export function createStudentSession(createSeesionData: CreateSessionData) {
  return api.post<StudentSession>("/sessions", createSeesionData);
}

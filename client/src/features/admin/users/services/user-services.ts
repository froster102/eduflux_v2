import { CreateTutorData } from "../types/types";

import api from "@/lib/axios";

export async function createTutor(data: CreateTutorData) {
  return api.post<Tutor>("/users/tutors", data);
}

export async function getAllUsers(queryParams: QueryParams) {
  const { page, pageSize, searchKey, searchQuery, filters } = queryParams;
  const params: Record<string, any> = {
    searchQuery,
    page,
    pageSize,
    searchKey,
  };

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      const { key, value } = filter;

      params[`filters[${key}]`] = value;
    });
  }

  Object.keys(queryParams).forEach((key) =>
    params[key] === "undefined" || params[key] === null
      ? delete params[key]
      : {},
  );

  return api.get<{
    users: User[];
    totalCount: number;
  }>("/users", { params });
}

export async function blockUser(userId: string) {
  return api.patch<Student>(`/users/${userId}/block`);
}

export async function unblockUser(userId: string) {
  return api.patch<Student>(`/users/${userId}/unblock`);
}

export function unEnrollCourse({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  return api.patch<Course>(
    `/students/${userId}/enrolled-courses/${courseId}/unenroll`,
  );
}

export function assignCourse({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  return api.post<Tutor>("/tutors/courses", { userId, courseId });
}

export function removeCourse({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  return api.delete<Tutor>(`/tutors/${userId}/courses/${courseId}`);
}

import api from "@/lib/axios";

export function getAllEnrollments(queryParams: QueryParams) {
  const { page, pageSize, searchKey, searchQuery } = queryParams;
  const params: Record<string, any> = {
    page,
    pageSize,
    searchKey,
    searchQuery,
  };

  Object.keys(params).forEach((key) =>
    params[key] === "undefined" || params[key] === null
      ? delete params[key]
      : {},
  );

  return api.get<{
    enrollments: Enrollment[];
    totalCount: number;
  }>("/enrollments", { params });
}

export function approveEnrollment(enrollmentId: string) {
  return api.patch(`/enrollments/${enrollmentId}/approve`);
}

export function rejectEnrollment(enrollmentId: string) {
  return api.patch(`/enrollments/${enrollmentId}/reject`);
}

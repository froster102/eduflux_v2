import api from "@/lib/axios";

export function getStudentData(studentId: string) {
  return api.get<User>(`/users/${studentId}`);
}

export function getStudentSession(queryParams: QueryParams) {
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

  return api.get<{ totalCount: number; sessions: StudentSession[] }>(
    "/sessions",
    { params },
  );
}

export function cancelStudentSession(sessionId: string) {
  return api.patch<{ session: StudentSession }>(`sessions/${sessionId}/cancel`);
}

export function getUser(userId: string) {
  return api.get<User>(`/users/${userId}`);
}

export function markStudentSessionAsComplete(sessionId: string) {
  return api.patch<StudentSession>(`/sessions/${sessionId}/mark-as-complete`);
}

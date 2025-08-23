import api from "@/lib/axios";
import { buildQueryUrlParams } from "@/utils/helpers";

export async function getInstructorProfile(
  userId: string,
): Promise<InstructorProfile> {
  const response = await api.get(`/users/${userId}`);

  return response.data;
}

export async function becomeAInstructor() {
  const response = await api.post(`/auth/users/me/roles`, {
    role: "INSTRUCTOR",
  });

  return response.data;
}

export async function getInstructors(
  paginationQueryParams: PaginationQueryParams,
): Promise<{ instructors: InstructorProfile[]; total: number }> {
  const params = buildQueryUrlParams(paginationQueryParams);

  const response = await api.get(`/users/instructors${params}`);

  return response.data;
}

export async function getInstructorAvailableSlots(data: {
  instructorId: string;
  date: string;
  timeZone: string;
}): Promise<AvailableSlots[]> {
  const response = await api.get(
    `/sessions/instructors/${data.instructorId}/slots?date=${data.date}&timeZone=${data.timeZone}`,
  );

  return response.data;
}

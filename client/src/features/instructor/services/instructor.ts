import api from "@/lib/axios";
import { buildQueryUrlParams } from "@/utils/helpers";

export async function getInstructorProfile(
  userId: string,
): Promise<Instructor> {
  const response = await api.get(`/query/instructors/${userId}`);

  return response.data;
}

export async function becomeAInstructor() {
  const response = await api.post(`/auth/users/me/roles`, {
    role: "INSTRUCTOR",
  });

  return response.data;
}

export async function getInstructors(
  queryParameters: GetInstructorsQueryParameters,
): Promise<GetInstructorsResult> {
  const queryString = buildQueryUrlParams(queryParameters);

  const response = await api.get(`/query/instructors${queryString}`);

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

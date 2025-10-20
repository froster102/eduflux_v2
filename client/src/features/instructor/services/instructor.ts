import api from "@/lib/axios";
import { buildJsonApiQueryString } from "@/utils/helpers";

export async function getInstructorProfile(
  userId: string,
): Promise<JsonApiResponse<Instructor>> {
  const response = await api.get(`/users/instructors/${userId}/`);

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
  const queryString = buildJsonApiQueryString(queryParameters);

  const response = await api.get(`/users/instructors${queryString}`);

  return response.data;
}

export async function getInstructorAvailableSlots(data: {
  instructorId: string;
  date: string;
  timeZone: string;
}): Promise<JsonApiResponse<AvailableSlots[]>> {
  const response = await api.get(
    `/sessions/instructors/${data.instructorId}/slots?date=${data.date}&timeZone=${data.timeZone}`,
  );

  return response.data;
}

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

export async function getInstructorStats(): Promise<
  JsonApiResponse<InstructorStats>
> {
  const response = await api.get("/users/instructors/me/stats");

  return response.data;
}

export async function getInstructorAvailableSlots(data: {
  instructorId: string;
  queryParams: AvailabilitySlotQueryParameters;
}): Promise<JsonApiResponse<AvailableSlots[]>> {
  const queryString = buildJsonApiQueryString(data.queryParams);
  const response = await api.get(
    `/sessions/instructors/${data.instructorId}/slots${queryString}`,
  );

  return response.data;
}

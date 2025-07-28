import api from "@/lib/axios";
import { buildQueryUrlParams } from "@/utils/helpers";

export async function getInstructors(
  paginationQueryParams: PaginationQueryParams,
): Promise<{ instructors: InstructorProfile[]; total: number }> {
  const params = buildQueryUrlParams(paginationQueryParams);

  const response = await api.get(`/users/instructors${params}`);

  return response.data;
}

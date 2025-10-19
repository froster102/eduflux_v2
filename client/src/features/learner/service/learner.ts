import api from "@/lib/axios";

export async function getLearnerStats(): Promise<
  JsonApiResponse<LearnerStats>
> {
  const response = await api.get("/users/learners/me");

  return response.data;
}

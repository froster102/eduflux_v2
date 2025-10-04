import api from "@/lib/axios";

export async function getLearnerStats(): Promise<LearnerStats> {
  const response = await api.get("/users/learners/me");

  return response.data;
}

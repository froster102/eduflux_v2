import api from "@/lib/axios";

export async function getUserProfile(): Promise<JsonApiResponse<UserProfile>> {
  const response = await api.get("/users/me");

  return response.data;
}

export async function updateProfile(
  data: Partial<UserProfile>,
): Promise<JsonApiResponse<UserProfile>> {
  const response = await api.put(`/users/me`, data);

  return response.data;
}

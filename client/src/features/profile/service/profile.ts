import api from "@/lib/axios";

export async function getUserProfile(): Promise<UserProfile> {
  const response = await api.get("/users/me");

  return response.data;
}

export async function updateProfile(
  data: Partial<UserProfile>,
): Promise<UserProfile> {
  const response = await api.put(`/users/me`, data);

  return response.data;
}

import api from "@/lib/axios";

export async function becomeAInstructor() {
  const response = await api.post(`/auth/users/me/roles`, {
    role: "INSTRUCTOR",
  });

  return response.data;
}

export async function getInstructorProfile(
  userId: string,
): Promise<UserProfile> {
  const response = await api.get(`/users/${userId}`);

  return response.data;
}

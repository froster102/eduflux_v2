import api from "@/lib/axios";

export function updateTutorProfile({
  userId,
  updateData,
}: {
  userId: string;
  updateData: Partial<Tutor>;
}) {
  return api.put(`/users/${userId}`, updateData);
}

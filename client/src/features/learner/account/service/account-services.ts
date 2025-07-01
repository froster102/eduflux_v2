import api from "@/lib/axios";

export function updateStudentProfile({
  userId,
  updateData,
}: {
  userId: string;
  updateData: Partial<Student>;
}) {
  return api.put<User>(`/users/${userId}`, updateData);
}

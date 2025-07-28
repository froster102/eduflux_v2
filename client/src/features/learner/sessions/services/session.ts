import api from "@/lib/axios";

export async function getInstructorAvailableSlots(data: {
  instructorId: string;
  date: string;
  timeZone: string;
}): Promise<AvailableSlots[]> {
  const response = await api.get(
    `/sessions/instructors/${data.instructorId}/slots?date=${data.date}&timeZone=${data.timeZone}`,
  );

  return response.data;
}

export async function bookSession(data: {
  slotId: string;
}): Promise<{ id: string; checkoutUrl: string }> {
  const response = await api.post("/sessions/bookings", data);

  return response.data;
}

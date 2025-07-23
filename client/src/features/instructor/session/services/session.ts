import api from "@/lib/axios";

export async function getUserSessionPricing(): Promise<{
  id: string;
  price: number;
  currency: string;
  duration: number;
} | null> {
  const response = await api.get("/users/me/session-pricing");

  return response.data;
}

export async function updateUserSessionPricing(data: { price: number }) {
  const response = await api.put("/users/me/session-pricing", data);

  return response.data;
}

export async function getInstructorScheduleSetting(): Promise<{
  setting: ScheduleSetting;
}> {
  const response = await api.get("/sessions/me/schedule-setting");

  return response.data;
}

export async function updateInstructorWeeklyAvailability(data: {
  weeklySchedule: DailyAvailabilityConfig[];
  applyForWeeks: number;
}): Promise<void> {
  const response = await api.put("/sessions/me/schedule", data);

  return response.data;
}

import { SessionSettingsFormData } from "../validation/session-schema";

import api from "@/lib/axios";

export async function getUserSessionPricing(): Promise<SessionPricing> {
  const response = await api.get("/users/me/session-pricing");

  return response.data;
}

export async function enableSessions(data: SessionSettingsFormData) {
  const response = await api.post("/sessions/settings", data);

  return response.data;
}

export async function getInstructorSessionSettings(): Promise<{
  settings: SessionSettings;
}> {
  const response = await api.get("/sessions/settings");

  return response.data;
}

export async function updateInstructorSessionSettings(
  data: Partial<SessionSettings>,
): Promise<void> {
  const response = await api.put("/sessions/settings", data);

  return response.data;
}

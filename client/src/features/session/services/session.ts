import api from "@/lib/axios";

import { SessionSettingsFormData } from "../validation/session-schema";

export async function enableSessions(data: SessionSettingsFormData) {
  const response = await api.post("/sessions/settings", data);

  return response.data;
}

export async function bookSession(data: {
  slotId: string;
}): Promise<{ id: string; checkoutUrl: string }> {
  const response = await api.post("/sessions/bookings", data);

  return response.data;
}

export async function getUserSessions(
  queryParameters: QueryParmeters & { type: "learner" | "instructor" },
): Promise<GetUserSessionsResult> {
  const response = await api.get("/query/sessions/");

  return response.data;
}

export async function getSessionSettings(): Promise<{
  settings: SessionSettings;
}> {
  const response = await api.get("/sessions/settings");

  return response.data;
}

export async function updateSessionSettings(
  data: Partial<SessionSettings>,
): Promise<void> {
  const response = await api.put("/sessions/settings", data);

  return response.data;
}

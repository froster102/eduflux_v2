import api from "@/lib/axios";
import { buildJsonApiQueryString } from "@/utils/helpers";

import { SessionSettingsFormData } from "../validation/session-schema";

export async function enableSessions(data: SessionSettingsFormData) {
  const response = await api.post("/sessions/settings", data);

  return response.data;
}

export async function bookSession(data: {
  slotId: string;
}): Promise<BookSessionResponse> {
  const response = await api.post("/sessions/bookings", data);

  return response.data;
}

export async function getUserSessions(
  queryParameters: GetUserSessionQueryParams,
): Promise<GetUserSessionsResult> {
  let queryString = "";

  if (queryParameters) {
    queryString = buildJsonApiQueryString(queryParameters);
  }
  const response = await api.get(`/sessions/me${queryString}`);

  return response.data;
}

export async function getSessionSettings(): Promise<
  JsonApiResponse<{
    settings: SessionSettings;
  }>
> {
  const response = await api.get("/sessions/settings");

  return response.data;
}

export async function updateSessionSettings(
  data: Partial<SessionSettings>,
): Promise<void> {
  const response = await api.put("/sessions/settings", data);

  return response.data;
}

export async function joinSession(
  sessionId: string,
): Promise<JsonApiResponse<JoinSessionResponse>> {
  const response = await api.get(`/sessions/${sessionId}/tokens`);

  return response.data;
}

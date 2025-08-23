import { graphql } from "gql.tada";

import { graphqlClient } from "@/lib/graphql/graphql-client";
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

export async function getSessions(
  queryParameters: QueryParmeters & { type: "learner" | "instructor" },
) {
  const getSessionQuery = graphql(`
    query ($page: Int, $type: String) {
      sessions(page: $page, type: $type) {
        sessions {
          id
          startTime
          status
          endTime
          instructor {
            firstName
            lastName
            email
            image
          }
          learner {
            firstName
            lastName
            email
            image
          }
        }
        pagination {
          currentPage
          totalPages
        }
      }
    }
  `);

  const response = await graphqlClient.request(getSessionQuery, {
    page: 1,
    type: queryParameters.type,
  });

  return response.sessions.sessions;
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

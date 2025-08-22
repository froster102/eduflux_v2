import { graphql } from "gql.tada";

import api from "@/lib/axios";
import { graphqlClient } from "@/lib/graphql/graphql-client";

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

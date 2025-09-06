import { graphql } from "gql.tada";

import api from "@/lib/axios";
import { graphqlClient } from "@/lib/graphql/graphql-client";

export async function createChat(instructorId: string): Promise<Chat> {
  const response = await api.post("/chats/", { instructorId });

  return response.data;
}

export async function getChats(queryParameters: GetChatsQueryParmeters) {
  const getChatsQuery = graphql(`
    query ($page: Int, $limit: Int, $role: Role) {
      chats(page: $page, limit: $limit, role: $role) {
        chats {
          id
          lastMessageAt
          createdAt
          lastMessagePreview
          participants {
            firstName
            lastName
            email
            id
            image
          }
        }
      }
    }
  `);

  const response = await graphqlClient.request(getChatsQuery, {
    page: queryParameters.page,
    limit: queryParameters.limit,
    role: queryParameters.role,
  });

  return response.chats.chats;
}

export async function getChat(
  instructorId: string,
): Promise<{ chat: Chat | null }> {
  const response = await api.get(`/chats/exists?instructorId=${instructorId}`);

  return response.data;
}

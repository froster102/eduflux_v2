import { graphql } from "gql.tada";

import api from "@/lib/axios";
import { graphqlClient } from "@/lib/graphql/graphql-client";
import { buildQueryUrlParams } from "@/utils/helpers";

export async function createChat(instructorId: string): Promise<Chat> {
  const response = await api.post("/chats/", { instructorId });

  return response.data;
}

export async function getChatChatHistory(
  queryParameters: GetChatsQueryParmeters,
) {
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

export async function getMessages(
  chatId: string,
  getMessagesQueryParameters?: GetMessagesQueryParameters,
): Promise<GetMessagesResponse> {
  let queryString = "";

  if (getMessagesQueryParameters) {
    queryString = buildQueryUrlParams(getMessagesQueryParameters);
  }
  const response = await api.get(`/chats/${chatId}${queryString}`);

  return response.data;
}

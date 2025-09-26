import api from "@/lib/axios";
import { buildQueryUrlParams } from "@/utils/helpers";

export async function createChat(instructorId: string): Promise<Chat> {
  const response = await api.post("/chats/", { instructorId });

  return response.data;
}

export async function getUserChatChatHistory(
  queryParameters: GetChatsQueryParmeters,
): Promise<GetUserChatsQueryResult> {
  const queryString = buildQueryUrlParams(queryParameters);

  const response = await api.get(`/query/chats${queryString}`);

  return response.data;
}

export async function getChatWithInstructor(
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

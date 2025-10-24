import api from "@/lib/axios";
import { buildJsonApiQueryString } from "@/utils/helpers";

export async function createChat(
  instructorId: string,
): Promise<JsonApiResponse<Chat>> {
  const response = await api.post<JsonApiResponse<Chat>>("/chats/", {
    instructorId,
  });

  return response.data;
}

export async function getUserChatChatHistory(
  queryParameters: GetChatsQueryParmeters,
): Promise<GetUserChatsQueryResult> {
  const queryString = buildJsonApiQueryString(queryParameters);

  const response = await api.get<GetUserChatsQueryResult>(
    `/chats/users/me${queryString}`,
  );

  return response.data;
}

export async function getChatWithInstructor(
  instructorId: string,
): Promise<GetChatWithInstructorResponse> {
  const response = await api.get<GetChatWithInstructorResponse>(
    `/chats/exists?filter[instructorId]=${instructorId}`,
  );

  return response.data;
}

export async function getMessages(
  chatId: string,
  getMessagesQueryParameters?: GetMessagesQueryParameters,
): Promise<GetMessagesResponse> {
  const query: GetMessagesQueryParameters = getMessagesQueryParameters || {
    page: { cursor: undefined, size: 20 },
  };

  let queryString = "";

  if (getMessagesQueryParameters) {
    queryString = buildJsonApiQueryString(query);
  }
  const response = await api.get<GetMessagesResponse>(
    `/chats/${chatId}${queryString}`,
  );

  return response.data;
}

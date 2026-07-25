import { apiClient } from "@/lib/api-client";
import { ChatThread, chatThreadSchema, type ApiResponse } from "@repo/shared";
import {
  getPromptSuggestionsResponseSchema,
  type GetPromptSuggestionsResponse,
} from "@repo/shared";

export const chatApi = {
  getPromptSuggestions: (): Promise<
    ApiResponse<GetPromptSuggestionsResponse>
  > => {
    return apiClient.get(
      "/api/chats/suggestions",
      getPromptSuggestionsResponseSchema
    );
  },
  getChatThread: (chatId: string): Promise<ApiResponse<ChatThread>> => {
    return apiClient.get(`/api/chats/${chatId}`, chatThreadSchema);
  },
};

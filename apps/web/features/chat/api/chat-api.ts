import { apiClient } from "@/lib/api-client";
import {
  ChatThread,
  chatThreadSchema,
  DeleteChatPayload,
  deleteChatPayloadSchema,
  EnhancePromptResponse,
  enhancePromptResponseSchema,
  GetChatsPayload,
  getChatsPayloadSchema,
  UpdateChatTitleResponse,
  updateChatTitleResponseSchema,
  type ApiResponse,
} from "@repo/shared";
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

  enhancePrompt: (
    prompt: string,
    chatId?: string
  ): Promise<ApiResponse<EnhancePromptResponse>> => {
    return apiClient.post(
      "/api/chats/enhance",
      { prompt, chatId },
      enhancePromptResponseSchema
    );
  },

  updateChatTitle: (
    chatId: string,
    title: string
  ): Promise<ApiResponse<UpdateChatTitleResponse>> => {
    return apiClient.put(
      `/api/chats/${chatId}/title`,
      { title },
      updateChatTitleResponseSchema
    );
  },

  getChats: (): Promise<ApiResponse<GetChatsPayload>> => {
    return apiClient.get("/api/chats", getChatsPayloadSchema);
  },

  deleteChat: (chatId: string): Promise<ApiResponse<DeleteChatPayload>> => {
    return apiClient.delete(`/api/chats/${chatId}`, deleteChatPayloadSchema);
  },
};

import { apiClient } from "@/lib/api-client";
import { type ApiResponse } from "@repo/shared";
import {
  getPromptSuggestionsResponseSchema,
  type GetPromptSuggestionsResponse,
} from "@repo/shared";

export const chatApi = {
  getPromptSuggestions: (): Promise<
    ApiResponse<GetPromptSuggestionsResponse>
  > => {
    return apiClient.get(
      "/chats/suggestions",
      getPromptSuggestionsResponseSchema
    );
  },
};

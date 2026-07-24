"use server";

import {
  type ApiResponse,
  type GetPromptSuggestionsResponse,
} from "@repo/shared";
import { chatApi } from "../api/chat-api";

export async function getPromptSuggestionsAction(): Promise<
  ApiResponse<GetPromptSuggestionsResponse>
> {
  return chatApi.getPromptSuggestions();
}

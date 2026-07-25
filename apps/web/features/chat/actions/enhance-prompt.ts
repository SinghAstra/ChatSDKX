"use server";

import { type ApiResponse, type EnhancePromptResponse } from "@repo/shared";
import { chatApi } from "../api/chat-api";

export async function enhancePromptAction(
  prompt: string,
  chatId?: string
): Promise<ApiResponse<EnhancePromptResponse>> {
  return chatApi.enhancePrompt(prompt, chatId);
}

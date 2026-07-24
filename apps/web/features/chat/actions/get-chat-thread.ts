"use server";

import { type ApiResponse, type ChatThread } from "@repo/shared";
import { chatApi } from "../api/chat-api";

export async function getChatThreadAction(
  chatId: string
): Promise<ApiResponse<ChatThread>> {
  return chatApi.getChatThread(chatId);
}

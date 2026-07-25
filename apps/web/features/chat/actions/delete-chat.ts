"use server";

import { type ApiResponse, type DeleteChatPayload } from "@repo/shared";
import { chatApi } from "../api/chat-api";

export async function deleteChatAction(
  chatId: string
): Promise<ApiResponse<DeleteChatPayload>> {
  return chatApi.deleteChat(chatId);
}

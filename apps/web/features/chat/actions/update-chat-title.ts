"use server";

import { type ApiResponse, type UpdateChatTitleResponse } from "@repo/shared";
import { chatApi } from "../api/chat-api";

export async function updateChatTitleAction(
  chatId: string,
  title: string
): Promise<ApiResponse<UpdateChatTitleResponse>> {
  return chatApi.updateChatTitle(chatId, title);
}

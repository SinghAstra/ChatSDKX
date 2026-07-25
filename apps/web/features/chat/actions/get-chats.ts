"use server";

import { type ApiResponse, type GetChatsPayload } from "@repo/shared";
import { chatApi } from "../api/chat-api";

export async function getChatsAction(): Promise<ApiResponse<GetChatsPayload>> {
  return chatApi.getChats();
}

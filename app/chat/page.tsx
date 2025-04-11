import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { cookies } from "next/headers";
import React from "react";
import ChatClientPage from "./chat-client-page";

const ChatPage = async () => {
  const cookieStore = await cookies();
  const initialChatModelId =
    cookieStore.get("chat-model")?.value || DEFAULT_CHAT_MODEL;
  return <ChatClientPage initialChatModelId={initialChatModelId} />;
};

export default ChatPage;

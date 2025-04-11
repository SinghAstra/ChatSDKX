import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { Visibility } from "@prisma/client";
import { cookies } from "next/headers";
import React from "react";
import ChatClientPage from "./chat-client-page";

const ChatPage = async () => {
  const cookieStore = await cookies();
  const chatModel = cookieStore.get("chat-model")?.value || DEFAULT_CHAT_MODEL;
  const chatVisibility =
    (cookieStore.get("chat-visibility")?.value as Visibility) ||
    ("private" as Visibility);
  return (
    <ChatClientPage chatModel={chatModel} chatVisibility={chatVisibility} />
  );
};

export default ChatPage;

import { ChatReasoningId } from "@/interfaces/ai";
import { DEFAULT_CHAT_REASONING } from "@/lib/ai/models";
import { generateID } from "@/lib/utils";
import { Visibility } from "@prisma/client";
import { cookies } from "next/headers";
import React from "react";
import ChatClientPage from "./chat-client-page";

const ChatPage = async () => {
  const cookieStore = await cookies();
  const chatReasoningId =
    (cookieStore.get("chat-reasoning")?.value as ChatReasoningId) ||
    (DEFAULT_CHAT_REASONING as ChatReasoningId);
  const chatVisibility =
    (cookieStore.get("chat-visibility")?.value as Visibility) ||
    ("private" as Visibility);

  const id = generateID();

  console.log("In chat/page.tsx id is ", id);

  return (
    <ChatClientPage
      id={id}
      initialMessages={[]}
      chatReasoningId={chatReasoningId}
      chatVisibility={chatVisibility}
      isReadOnly={false}
    />
  );
};

export default ChatPage;

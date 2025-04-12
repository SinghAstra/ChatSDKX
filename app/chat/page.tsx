import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { generateID } from "@/lib/utils";
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

  const id = generateID();

  console.log("In chat/page.tsx id is ", id);

  return (
    <ChatClientPage
      id={id}
      initialMessages={[]}
      chatModel={chatModel}
      chatVisibility={chatVisibility}
      isReadOnly={false}
    />
  );
};

export default ChatPage;

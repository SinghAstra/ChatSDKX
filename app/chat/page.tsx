import { generateID } from "@/lib/utils";
import { Visibility } from "@prisma/client";
import { cookies } from "next/headers";
import React from "react";
import ChatClientPage from "./chat-client-page";

const ChatPage = async () => {
  const cookieStore = await cookies();
  const chatVisibility =
    (cookieStore.get("chat-visibility")?.value as Visibility) ||
    ("private" as Visibility);

  const id = generateID();

  return (
    <ChatClientPage
      id={id}
      initialMessages={[]}
      chatVisibility={chatVisibility}
      isReadOnly={false}
    />
  );
};

export default ChatPage;

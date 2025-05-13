import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";
import Chat from "../chat";
import { fetchChat } from "./action";

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  const chat = await fetchChat(params.id);

  if (!chat) {
    notFound();
  }

  console.log(chat.messages[chat.messages.length - 1]);

  return (
    <Chat
      initialMessages={chat.messages}
      user={session.user}
      chatId={params.id}
      newChat={false}
    />
  );
};

export default ChatPage;

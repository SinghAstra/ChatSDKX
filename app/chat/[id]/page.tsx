import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { fetchChat } from "./action";
import ChatClientPage from "./chat-client-page";

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  const chat = await fetchChat(params.id);

  if (!chat) {
    notFound();
  }

  console.log(
    "In /chat/:id server component chat.messages.length is ",
    chat.messages.length
  );

  return <ChatClientPage initialMessages={chat.messages} />;
};

export default ChatPage;

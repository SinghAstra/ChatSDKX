import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";
import Chat from "../../../chat/chat";
import { fetchChat } from "./action";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const chat = await fetchChat(params.id);

  if (!chat) {
    return;
  }

  return {
    title: chat.title,
  };
}

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  const chat = await fetchChat(params.id);

  if (!chat) {
    notFound();
  }

  console.log("In /chat/:id server page.");
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

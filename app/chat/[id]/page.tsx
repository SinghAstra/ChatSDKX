import { authOptions } from "@/lib/auth-options";
import { Visibility } from "@prisma/client";
import { UIMessage } from "ai";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import React from "react";
import ChatClientPage from "../chat-client-page";
import { fetchChat } from "./action";

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const cookieStore = await cookies();
  const chatVisibility =
    (cookieStore.get("chat-visibility")?.value as Visibility) ||
    ("private" as Visibility);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in");
  }

  const chat = await fetchChat(params.id);

  if (!chat) {
    notFound();
  }

  const uiMessages: UIMessage[] = chat.messages.map((msg) => {
    const parts = msg.parts as { type: "text"; text: string }[];
    const content = parts.map((p) => p.text).join("");

    return {
      id: msg.id,
      role: msg.role as "user" | "assistant",
      createdAt: msg.createdAt,
      parts,
      content,
    };
  });

  const isReadOnly = chat.userId !== session.user.id;

  return (
    <ChatClientPage
      id={params.id}
      initialMessages={uiMessages}
      chatVisibility={chatVisibility}
      isReadOnly={isReadOnly}
    />
  );
};

export default ChatPage;

import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import NewChatClientPage from "./new-chat-client-page";

const ChatPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/sign-in");
  }

  return <NewChatClientPage user={session.user} />;
};

export default ChatPage;

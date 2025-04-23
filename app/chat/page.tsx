import { authOptions } from "@/lib/auth-options";
import { generateID } from "@/lib/utils";
import { Visibility } from "@prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import NewChatClientPage from "./new-chat-client-page";

const ChatPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/sign-in");
  }
  const cookieStore = await cookies();
  const chatVisibility =
    (cookieStore.get("chat-visibility")?.value as Visibility) ||
    ("private" as Visibility);

  const id = generateID();

  return (
    <NewChatClientPage
      id={id}
      chatVisibility={chatVisibility}
      user={session.user}
    />
  );
};

export default ChatPage;

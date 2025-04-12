"use server";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { Visibility } from "@prisma/client";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

export async function fetchChats() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { message: "Authentication required", chats: [] };
    }

    const chats = await prisma.chat.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { chats };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to Fetch Chats", chats: [] };
  }
}

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function saveChatVisibilityAsCookie(visibility: Visibility) {
  const cookieStore = await cookies();
  cookieStore.set("chat-visibility", visibility);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const { text: title } = await generateText({
    model: myProvider.languageModel("title-model"),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

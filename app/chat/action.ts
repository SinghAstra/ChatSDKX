"use server";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { generateTitleFromUserMessage } from "@/lib/utils";
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

export async function createChat(id: string, message: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { message: "Authentication required" };
    }

    const title = await generateTitleFromUserMessage(message);

    const chat = await prisma.chat.create({
      data: {
        id,
        userId: session.user.id,
        title,
        createdAt: new Date(),
      },
    });
    return { chat };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to Create Chat" };
  }
}

export async function saveChatVisibilityAsCookie(visibility: Visibility) {
  const cookieStore = await cookies();
  cookieStore.set("chat-visibility", visibility);
}

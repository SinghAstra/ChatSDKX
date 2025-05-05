"use server";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { generateTitleFromUserMessage } from "@/lib/utils";
import { getServerSession } from "next-auth";

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

export async function createChat(message: string, id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { message: "Authentication required" };
    }

    const chat = await prisma.chat.create({
      data: {
        id,
        userId: session.user.id,
        createdAt: new Date(),
      },
    });

    generateTitleFromUserMessage(message, chat.id);

    console.log("chat is ", chat);
    return { chat };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to Create Chat" };
  }
}

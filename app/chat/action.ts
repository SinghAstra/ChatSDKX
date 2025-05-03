"use server";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { generateTitleFromUserMessage } from "@/lib/utils";
import { Role } from "@prisma/client";
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

export async function createChat(message: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { message: "Authentication required" };
    }

    const title = (await generateTitleFromUserMessage(message)) || "No Title";

    const chat = await prisma.chat.create({
      data: {
        userId: session.user.id,
        title,
        createdAt: new Date(),
      },
    });

    const newMessage = await prisma.message.create({
      data: {
        chatId: chat.id,
        role: Role.user,
        content: message,
      },
    });

    console.log("chat is ", chat);
    console.log("newMessage is ", newMessage);
    return { chat };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to Create Chat" };
  }
}

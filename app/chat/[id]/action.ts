"use server";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { generateAndUpdateTitle } from "@/lib/utils";
import { getServerSession } from "next-auth";

export async function fetchChat(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const chat = await prisma.chat.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chat) {
    return null;
  }

  if (chat.userId === session.user.id) {
    return chat;
  }
}

export async function createChatInDB(
  id: string,
  userId: string,
  message: string
) {
  await prisma.chat.create({
    data: {
      id,
      title: "New Chat",
      userId,
      createdAt: new Date(),
    },
  });
  generateAndUpdateTitle(id, message);
}

import { prisma } from "@repo/db";
import {
    CHAT_ERROR_CODES,
    DeleteChatPayload,
    GetChatsPayload
} from "@repo/shared";
import { AppError } from "../errors/api-errors.js";

export const chatService = {
  getChats: async (userId: string): Promise<GetChatsPayload> => {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
    }));
  },

  deleteChat: async (
    userId: string,
    chatId: string
  ): Promise<DeleteChatPayload> => {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new AppError(
        404,
        CHAT_ERROR_CODES.CHAT_NOT_FOUND,
        "We couldn't find that chat."
      );
    }

    if (chat.userId !== userId) {
      throw new AppError(
        403,
        CHAT_ERROR_CODES.UNAUTHORIZED_CHAT_ACCESS,
        "You can only delete your own chats."
      );
    }

    await prisma.chat.delete({
      where: { id: chatId },
    });

    return {
      message: "Chat deleted.",
    };
  },
};
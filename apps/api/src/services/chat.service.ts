import { prisma } from "@repo/db";
import {
  CHAT_ERROR_CODES,
  DeleteChatPayload,
  GetChatsPayload,
  logError,
} from "@repo/shared";
import { AppError } from "../errors/api-errors";
import type { GetPromptSuggestionsResponse } from "@repo/shared";
import { geminiClient } from "../config/gemini";
import { DYNAMIC_SUGGESTIONS_PROMPT } from "../prompts/chat.prompt";
import { suggestionJsonSchema } from "../schemas/gemini.schema";

export const chatService = {
  async generatePromptSuggestions(): Promise<GetPromptSuggestionsResponse> {
    console.log("🤖 [Gemini] Generating dynamic prompt suggestions...");

    try {
      const interaction = await geminiClient.interactions.create({
        model: "gemini-3.6-flash",
        input: DYNAMIC_SUGGESTIONS_PROMPT,
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: suggestionJsonSchema,
        },
      });

      if (!interaction.output_text) {
        throw new Error("Gemini returned an empty or undefined output text.");
      }

      console.log("🤖 [Gemini] Successfully generated prompt suggestions.");

      return JSON.parse(
        interaction.output_text
      ) as GetPromptSuggestionsResponse;
    } catch (error) {
      console.error(
        "🤖❌ [Gemini Error] Failed to generate dynamic suggestions, using fallback."
      );

      logError(error);

      return [
        {
          iconName: "Code",
          title: "Review this code",
          prompt: "Can you help me optimize this React component?",
        },
        {
          iconName: "Terminal",
          title: "Debug an error",
          prompt: "I'm getting a hydration mismatch error in Next.js.",
        },
        {
          iconName: "Database",
          title: "Design a schema",
          prompt:
            "What are some good PostgreSQL database schemas for a chat app?",
        },
        {
          iconName: "MessageSquare",
          title: "Explain a concept",
          prompt: "Explain how JavaScript closures work under the hood.",
        },
      ];
    }
  },

  getChats: async (userId: string): Promise<GetChatsPayload> => {
    console.log(`🗄️ [DB] Fetching chat history for user: ${userId}`);

    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    console.log(`🗄️ [DB] Successfully retrieved ${chats.length} chats.`);

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
    console.log(`🗄️ [DB] Validating ownership for chat: ${chatId}`);

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
      console.warn(
        `🗄️❌ [DB Warning] Unauthorized delete attempt on chat: ${chatId} by user: ${userId}`
      );

      throw new AppError(
        403,
        CHAT_ERROR_CODES.UNAUTHORIZED_CHAT_ACCESS,
        "You can only delete your own chats."
      );
    }

    console.log(`🗄️ [DB] Executing deletion for chat: ${chatId}`);

    await prisma.chat.delete({
      where: { id: chatId },
    });

    console.log(`🗄️ [DB] Successfully deleted chat: ${chatId}`);

    return {
      message: "Chat deleted.",
    };
  },
};

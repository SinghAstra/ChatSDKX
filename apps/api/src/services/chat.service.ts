import { prisma } from "@repo/db";
import {
  CHAT_ERROR_CODES,
  CHAT_ROLE,
  DeleteChatPayload,
  GetChatsPayload,
  logError,
} from "@repo/shared";
import { AppError } from "../errors/api-errors";
import type {
  ChatRole,
  ChatThread,
  GetPromptSuggestionsResponse,
} from "@repo/shared";
import { geminiClient } from "../config/gemini";
import {
  buildTitleGenerationPrompt,
  DYNAMIC_SUGGESTIONS_PROMPT,
} from "../prompts/chat.prompt";
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

  getChatThread: async (
    userId: string,
    chatId: string
  ): Promise<ChatThread> => {
    console.log(`🗄️ [DB] Fetching thread for chat: ${chatId}`);

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!chat)
      throw new AppError(
        404,
        CHAT_ERROR_CODES.CHAT_NOT_FOUND,
        "We couldn't find that chat."
      );

    if (chat.userId !== userId)
      throw new AppError(
        403,
        CHAT_ERROR_CODES.UNAUTHORIZED_CHAT_ACCESS,
        "You can only view your own chats."
      );

    return {
      id: chat.id,
      title: chat.title,
      messages: chat.messages.map((msg) => ({
        id: msg.id,
        role: msg.role as ChatRole,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
      })),
    };
  },

  streamMessage: async function* (
    userId: string,
    chatId: string,
    content: string
  ): AsyncGenerator<string, void, unknown> {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });

    let isNewChat = false;

    if (!chat) {
      isNewChat = true;

      console.log(`🗄️ [DB] Creating new chat session: ${chatId}`);

      await prisma.chat.create({
        data: {
          id: chatId,
          userId,
          title: null,
        },
      });
    } else if (chat.userId !== userId) {
      throw new AppError(
        403,
        CHAT_ERROR_CODES.UNAUTHORIZED_CHAT_ACCESS,
        "Unauthorized access to this chat."
      );
    }

    await prisma.message.create({
      data: { chatId, role: CHAT_ROLE.USER, content },
    });

    console.log(`🤖 [Gemini] Starting stream for chat: ${chatId}`);

    const stream = await geminiClient.interactions.create({
      model: "gemini-3.6-flash",
      input: content,
      stream: true,
    });

    let fullAssistantResponse = "";

    for await (const event of stream) {
      if (
        event.event_type === "step.delta" &&
        event.delta?.type === "text" &&
        event.delta?.text
      ) {
        const chunk = event.delta.text;

        fullAssistantResponse += chunk;

        yield chunk;
      }
    }

    console.log(`🗄️ [DB] Saving assistant response for chat: ${chatId}`);

    await prisma.message.create({
      data: {
        chatId,
        role: CHAT_ROLE.ASSISTANT,
        content: fullAssistantResponse,
      },
    });

    if (isNewChat) {
      generateAndSaveChatTitle(chatId, content).catch(console.error);
    }
  },
};

async function generateAndSaveChatTitle(
  chatId: string,
  firstMessage: string
): Promise<void> {
  console.log(`🤖 [Gemini] Generating title in background for chat: ${chatId}`);

  try {
    const prompt = buildTitleGenerationPrompt(firstMessage);

    const interaction = await geminiClient.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });

    const generatedTitle = interaction.output_text?.trim();

    if (!generatedTitle) {
      throw new Error("Received empty title from Gemini.");
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: { title: generatedTitle },
    });

    console.log(
      `🗄️ [DB] Successfully saved generated title for chat: ${chatId}`
    );
  } catch (error) {
    console.error(
      `🤖❌ [Gemini Error] Failed to generate title for chat: ${chatId}`
    );

    logError(error);
  }
}

import { prisma } from "@repo/db";
import {
  CHAT_ERROR_CODES,
  DeleteChatPayload,
  GetChatsPayload,
  logError,
  CHAT_ROLE,
} from "@repo/shared";
import { AppError } from "../errors/api-errors";
import type {
  GetPromptSuggestionsResponse,
  ChatThread,
  ChatRole,
} from "@repo/shared";
import { groqClient } from "../config/groq";
import {
  DYNAMIC_SUGGESTIONS_PROMPT,
  buildTitleGenerationPrompt,
} from "../prompts/chat.prompt";

export const chatService = {
  async generatePromptSuggestions(): Promise<GetPromptSuggestionsResponse> {
    console.log("⚡ [Groq] Generating dynamic prompt suggestions...");

    try {
      const completion = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that outputs valid JSON conforming to the requested structure.",
          },
          { role: "user", content: DYNAMIC_SUGGESTIONS_PROMPT },
        ],
        response_format: {
          type: "json_object",
        },
      });

      const outputText = completion.choices[0]?.message?.content;

      if (!outputText) {
        throw new Error("Groq returned an empty or undefined output text.");
      }

      console.log("⚡ [Groq] Successfully generated prompt suggestions.");

      const parsed = JSON.parse(outputText);

      const suggestions = parsed.suggestions || parsed;

      return suggestions as GetPromptSuggestionsResponse;
    } catch (error) {
      console.error(
        "⚡❌ [Groq Error] Failed to generate dynamic suggestions, using fallback."
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

    const chat = await prisma.chat.findUnique({ where: { id: chatId } });

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
        "You can only delete your own chats."
      );

    console.log(`🗄️ [DB] Executing deletion for chat: ${chatId}`);

    await prisma.chat.delete({ where: { id: chatId } });

    console.log(`🗄️ [DB] Successfully deleted chat: ${chatId}`);

    return { message: "Chat deleted." };
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

    // Fetch previous messages for conversation context if needed, or just send current prompt
    console.log(`⚡ [Groq] Starting stream for chat: ${chatId}`);

    const stream = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content },
      ],
      stream: true,
    });

    let fullAssistantResponse = "";

    for await (const chunk of stream) {
      const deltaText = chunk.choices[0]?.delta?.content;

      if (deltaText) {
        fullAssistantResponse += deltaText;

        yield deltaText;
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
  console.log(`⚡ [Groq] Generating title in background for chat: ${chatId}`);

  try {
    const prompt = buildTitleGenerationPrompt(firstMessage);

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const generatedTitle = completion.choices[0]?.message?.content?.trim();

    if (!generatedTitle) {
      throw new Error("Received empty title from Groq.");
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
      `⚡❌ [Groq Error] Failed to generate title for chat: ${chatId}`
    );

    logError(error);
  }
}

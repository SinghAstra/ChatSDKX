import { systemPrompt } from "@/lib/ai/prompt";
import { myProvider } from "@/lib/ai/providers";
import { createDocument } from "@/lib/ai/tools/create-document";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import {
  generateID,
  generateTitleFromUserMessage,
  getMostRecentUserMessage,
} from "@/lib/utils";
import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from "ai";
import { getServerSession } from "next-auth";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      chatReasoningId,
    }: {
      id: string;
      messages: Array<UIMessage>;
      chatReasoningId: string;
    } = await request.json();

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("Destructured req.json() is ", {
      id,
      messages,
      chatReasoningId,
    });

    const userMessage = getMostRecentUserMessage(messages);

    console.log("most recent user message is ", userMessage);

    if (!userMessage) {
      return new Response("No user message found", { status: 400 });
    }

    const chat = await prisma.chat.findUnique({ where: { id } });

    console.log("chat is ", chat);

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      const newChat = await prisma.chat.create({
        data: { id, userId: session.user.id, title, createdAt: new Date() },
      });

      console.log("newChat is ", newChat);
    } else {
      if (chat.userId !== session.user.id) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    await prisma.message.create({
      data: {
        chatId: id,
        id: userMessage.id,
        role: "user",
        parts: JSON.parse(JSON.stringify(userMessage.parts)),
        attachments:
          JSON.parse(JSON.stringify(userMessage.experimental_attachments)) ??
          [],
        createdAt: new Date(),
      },
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const prompt = systemPrompt({ selectedChatModel: chatReasoningId });
        console.log("prompt is ", prompt);
        const result = streamText({
          model: myProvider.languageModel(chatReasoningId),
          system: prompt,
          messages,
          maxSteps: 5,
          experimental_activeTools:
            chatReasoningId === "reasoning-model"
              ? []
              : [
                  "getWeather",
                  "createDocument",
                  "updateDocument",
                  "requestSuggestions",
                ],
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateID,
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
          },
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === "assistant"
                  ),
                });

                if (!assistantId) {
                  throw new Error("No assistant message found!");
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error("Failed to save chat");
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });
  } catch (error) {
    return new Response("An error occurred while processing your request!", {
      status: 404,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}

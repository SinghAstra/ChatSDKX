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
  getTrailingMessageId,
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

    let parsedUserExperimentalAttachments = [];

    if (userMessage.experimental_attachments) {
      parsedUserExperimentalAttachments = JSON.parse(
        JSON.stringify(userMessage.experimental_attachments)
      );
    }

    await prisma.message.create({
      data: {
        chatId: id,
        id: userMessage.id,
        role: "user",
        parts: JSON.parse(JSON.stringify(userMessage.parts)),
        attachments: parsedUserExperimentalAttachments,
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

                let parsedAssistantExperimentalAttachments = [];

                if (assistantMessage.experimental_attachments) {
                  parsedAssistantExperimentalAttachments = JSON.parse(
                    JSON.stringify(assistantMessage.experimental_attachments)
                  );
                }

                await prisma.message.create({
                  data: {
                    id: assistantId,
                    chatId: id,
                    role: assistantMessage.role,
                    parts: JSON.parse(JSON.stringify(userMessage.parts)),
                    attachments: parsedAssistantExperimentalAttachments,
                    createdAt: new Date(),
                  },
                });
              } catch (error) {
                if (error instanceof Error) {
                  console.log("error.stack is ", error.stack);
                  console.log("error.message is ", error.message);
                }
                console.error("Failed to save chat");
              }
            }
          },
          experimental_telemetry: {
            isEnabled: true,
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
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return new Response("An error occurred while processing your request!", {
      status: 404,
    });
  }
}

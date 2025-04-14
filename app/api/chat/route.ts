import { systemPrompt } from "@/lib/ai/prompt";
import { myProvider } from "@/lib/ai/providers";
import { markdownTool } from "@/lib/ai/tools/markdown-tool";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import {
  generateTitleFromUserMessage,
  getMostRecentUserMessage,
} from "@/lib/utils";
import {
  createDataStreamResponse,
  generateId,
  smoothStream,
  streamText,
} from "ai";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { id, messages, chatReasoningId } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response("No user message found", { status: 400 });
    }

    console.log("userMessage is ", userMessage);

    const chat = await prisma.chat.findUnique({ where: { id } });

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

    const newMessage = await prisma.message.create({
      data: {
        chatId: id,
        id: userMessage.id,
        role: "user",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parts: userMessage.parts as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        attachments: userMessage.experimental_attachments ?? ([] as any),
        createdAt: new Date(),
      },
    });

    console.log("newMessage is ", newMessage);

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: myProvider.languageModel(chatReasoningId),
          system: systemPrompt({ chatReasoningId }),
          messages,
          maxSteps: 5,
          experimental_activeTools: ["formatToMarkdown"],
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateId,
          tools: {
            formatToMarkdown: markdownTool,
          },
          // onFinish: async ({ response }) => {
          //   if (session.user?.id) {
          //     try {
          // const assistantId = getTrailingMessageId({
          //   messages: response.messages.filter(
          //     (message) => message.role === "assistant"
          //   ),
          // });
          // if (!assistantId) {
          //   throw new Error("No assistant message found!");
          // }
          // const [, assistantMessage] = appendResponseMessages({
          //   messages: [userMessage],
          //   responseMessages: response.messages,
          // });
          // await saveMessages({
          //   messages: [
          //     {
          //       id: assistantId,
          //       chatId: id,
          //       role: assistantMessage.role,
          //       parts: assistantMessage.parts,
          //       attachments:
          //         assistantMessage.experimental_attachments ?? [],
          //       createdAt: new Date(),
          //     },
          //   ],
          // });
          //     } catch (_) {
          //       console.error("Failed to save chat");
          //     }
          //   }
          // },
          // experimental_telemetry: {
          //   isEnabled: isProductionEnvironment,
          //   functionId: "stream-text",
          // },
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

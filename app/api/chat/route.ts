import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import {
  generateTitleFromUserMessage,
  getMostRecentUserMessage,
} from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { Message, streamText } from "ai";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { id, messages, chatModel } = await req.json();

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

  const result = await streamText({
    model: google("gemini-1.5-pro-latest"),
    messages: messages as Message[],
  });

  return result.toDataStreamResponse();
}

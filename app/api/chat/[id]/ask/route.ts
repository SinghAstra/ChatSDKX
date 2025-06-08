import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { chatSystemPrompt } from "@/lib/prompt";
import { generateAndUpdateTitle } from "@/lib/utils";
import { GoogleGenAI } from "@google/genai";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  const id = params.id;
  console.log("id is ", id);
  try {
    // 1. Parallel authentication and request parsing
    const [session, body] = await Promise.all([
      getServerSession(authOptions),
      req.json(),
    ]);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { message } = body;
    console.log("message is ", message);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required.");
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    // 3. Parallel database operations while streaming setup
    const [existingChat, lastMessages] = await Promise.all([
      prisma.chat.findFirst({ where: { id } }),
      prisma.message.findMany({
        where: { chatId: id },
        orderBy: { createdAt: "asc" },
        take: 10,
      }),
    ]);

    console.log("lastMessages is ", lastMessages);

    // 4. Handle chat creation asynchronously (don't block streaming)
    let chat = existingChat;
    if (!chat) {
      // Create chat with temporary title, update later
      chat = await prisma.chat.create({
        data: {
          id,
          title: "New Chat", // Temporary title
          userId: session.user.id,
          createdAt: new Date(),
        },
      });

      generateAndUpdateTitle(id, message);
    }

    // 5. Create user message asynchronously
    const userMessagePromise = prisma.message.create({
      data: {
        chatId: id,
        role: Role.user,
        content: message,
      },
    });

    // 6. Build history and start AI streaming immediately
    const history = lastMessages.map((msg) => ({
      role: msg.role === Role.user ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const aiChat = ai.chats.create({
      model: "gemini-2.0-flash",
      history,
    });

    const stream = await aiChat.sendMessageStream({
      config: {
        systemInstruction: chatSystemPrompt,
        temperature: 0.1,
      },
      message: message,
    });

    let fullResponse = "";

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          fullResponse += chunk.text;
          console.log("chunk.text is ", chunk.text);
          controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();

        // 8. Save responses asynchronously after streaming
        await Promise.all([
          userMessagePromise,
          prisma.message.create({
            data: {
              chatId: id,
              role: Role.model,
              content: fullResponse,
            },
          }),
        ]);
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return Response.json({ message: "Error occurred" });
  }
}

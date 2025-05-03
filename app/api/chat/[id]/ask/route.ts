import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { Role } from "@prisma/client";

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
    const { message } = await req.json();

    console.log("message is ", message);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required.");
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        {
          role: "user",
          parts: [{ text: "Hello" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });

    console.log("After Chat.");

    const newUserMessage = await prisma.message.create({
      data: {
        chatId: id,
        role: Role.user,
        content: message,
      },
    });

    console.log("newUserMessage is ", newUserMessage);

    const stream = await chat.sendMessageStream({
      message,
    });

    console.log("After stream.");
    let fullResponse = "";

    // 1. What is encoder ?
    const encoder = new TextEncoder();

    // 2. What is Readable Stream ?
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          fullResponse += chunk.text;
          console.log("chunk.text is ", chunk.text);
          controller.enqueue(encoder.encode(chunk.text));
        }
        controller.close();

        const newModelMessage = await prisma.message.create({
          data: {
            chatId: id,
            role: Role.model,
            content: fullResponse,
          },
        });
        console.log("newModelMessage is ", newModelMessage);
      },
    });

    // 3. Why are we setting those headers ?
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

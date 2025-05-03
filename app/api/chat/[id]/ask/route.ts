import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is required.");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const chat = ai.chats.create({ model: "gemini-1.5-flash" });

  const stream = await chat.sendMessageStream({ message });

  // 1. What is encoder ?
  const encoder = new TextEncoder();

  // 2. What is Readable Stream ?
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk.text));
      }
      controller.close();
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
}

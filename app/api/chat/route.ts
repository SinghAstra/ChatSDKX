import { authOptions } from "@/lib/auth-options";
import { anthropic } from "@ai-sdk/anthropic";
import { Message, streamText } from "ai";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { id, messages, chatModel } = await req.json();

  messages.map((message) => {
    console.log("message.parts is ", message.parts);
  });

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await streamText({
    model: openai(""),
    messages: messages as Message[],
  });

  return result.toDataStreamResponse();
}

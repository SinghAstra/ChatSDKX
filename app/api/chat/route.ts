import { authOptions } from "@/lib/auth-options";
import { google } from "@ai-sdk/google";
import { Message, streamText } from "ai";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await streamText({
    model: google("gemini-1.5-pro-latest"),
    messages: messages as Message[],
  });

  return result.toDataStreamResponse();
}

import { authOptions } from "@/lib/auth-options";
import { google } from "@ai-sdk/google";
import { Message, streamText, StreamTextResult, ToolSet } from "ai";
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
  let result: StreamTextResult<ToolSet, never>;
  try {
    result = await streamText({
      model: google("gemini-1.5-pro-latest"),
      messages: messages as Message[],
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
  }
  result = await streamText({
    model: google("gemini-1.5-pro-latest"),
    messages: messages as Message[],
  });

  return result.toDataStreamResponse();
}

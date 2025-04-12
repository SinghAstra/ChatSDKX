import { authOptions } from "@/lib/auth-options";
import { parseMdx } from "@/lib/markdown";
import { google } from "@ai-sdk/google";
import { Message, streamText } from "ai";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { id, messages, chatModel } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await streamText({
    model: google("gemini-1.5-pro-latest"),
    messages: messages as Message[],
  });

  let markdown = "";
  for await (const chunk of result.textStream) {
    markdown += chunk;
  }

  const compiledResult = await parseMdx(markdown);

  return Response.json({
    mdxCode: String(compiledResult),
  });
}

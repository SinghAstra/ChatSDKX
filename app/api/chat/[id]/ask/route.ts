import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { message } = await req.json();

    console.log("message is ", message);

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is required.");
    }

    let chat = await prisma.chat.findFirst({
      where: {
        id,
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          id,
          userId: session.user.id,
        },
      });
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const newUserMessage = await prisma.message.create({
      data: {
        chatId: id,
        role: Role.user,
        content: message,
      },
    });

    console.log("newUserMessage is ", newUserMessage);

    const lastMessages = await prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    const history = lastMessages.map((msg) => ({
      role: msg.role === Role.user ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    console.log("history is ", history);

    const aiChat = ai.chats.create({
      model: "gemini-2.0-flash",
      history,
    });

    console.log("After Chat.");
    const stream = await aiChat.sendMessageStream({
      config: {
        systemInstruction: `Respond using valid Markdown with proper formatting.
    
    - Use **\\n** only to separate regular paragraphs.
    - **Do not** use \\n after headings (e.g., ## Title) or add extra blank lines after headings.
      
    **Code Formatting Rules (important for syntax highlighting with Rehype Prism+ and Code Titles):**

    - For multi-line code, always wrap in triple backticks with the correct language tag.
    - **Use only these specific tags:**
      - \`\`\`js — for JavaScript
      - \`\`\`ts — for TypeScript
      - \`\`\`bash — for terminal commands
    - **Do not use** \`\`\`javascript or \`\`\`typescript — they will break syntax highlighting.

    **Code Titles (for rehype-code-titles):**
    - When showing a file name, add it as a title in the code block info string.
    - Syntax: \`\`\`js title=app.js

    **Examples:**

    JavaScript:
    \`\`\`js title=app.js
    // your JS code here
    \`\`\`

    TypeScript:
    \`\`\`ts title=main.ts
    // your TS code here
    \`\`\`

    Terminal:
    \`\`\`bash title=install.sh
    npm install some-package
    \`\`\`

    
    Write clean, properly indented code with no surrounding text inside code blocks. Only include one code block per language per response if possible.
    
    \n\n`,
      },
      message: message,
    });

    console.log("After stream.");
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

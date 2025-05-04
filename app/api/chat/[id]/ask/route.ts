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

    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history,
    });

    console.log("After Chat.");
    const stream = await chat.sendMessageStream({
      message: `Respond using **valid Markdown** with proper formatting.
    
    - Use **\\n** only to separate regular paragraphs.
    - **Do not** use \\n after headings (e.g., ## Title) or add extra blank lines after headings.
      
    **Code Formatting Rules (important for syntax highlighting with Rehype Prism+):**
    
    - For multi-line code, always wrap in triple backticks with the correct language tag.
    - **Use only these specific tags:**
      - \`\`\`js — for JavaScript
      - \`\`\`ts — for TypeScript
      - \`\`\`bash — for terminal commands
    - **Do not use** \`\`\`javascript or \`\`\`typescript — they will break syntax highlighting.
      
    **Examples:**
    
    JavaScript:
    \`\`\`js
    // your JS code here
    \`\`\`
    
    TypeScript:
    \`\`\`ts
    // your TS code here
    \`\`\`
    
    Terminal:
    \`\`\`bash
    npm install some-package
    \`\`\`
    
    Write clean, properly indented code with no surrounding text inside code blocks. Only include one code block per language per response if possible.
    
    Now respond to the following:\n\n${message}`,
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

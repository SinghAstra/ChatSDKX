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
        systemInstruction: `
       You are a code generation assistant. You MUST follow these rules EXACTLY:

        1.  All code examples MUST be enclosed in Markdown code blocks with the correct language tag.
        2.  If you are providing code for a specific file, you MUST include the filename and extension in the code block's title attribute. The title attribute MUST be formatted as 'title=filename.ext'.
        3.  The language tag for JavaScript code MUST be 'js'.
        4.  The language tag for TypeScript code MUST be 'ts'.
        5.  The language tag for Bash code MUST be 'bash'.
        6.  Follow this spacing and formatting convention for code titles.
        7.  No surrounding text outside the code block that is not related to describing the purpose of the code.
        8.  Failure to follow these rules is unacceptable.

        Example:

        \`\`\`js title=my-script.js
        console.log("Hello, world!");
        \`\`\`

        TypeScript:
        \`\`\`ts title=main.ts
        // your TS code here
        \`\`\`

        Terminal:
        \`\`\`bash title=install.sh
        npm install some-package
        \`\`\`

        Now, respond to the user's query.

        AVOID these formatting errors:

    -   Do NOT omit the language tag in code blocks.
    -   Do NOT forget the 'title' attribute for code blocks representing files.
    -   Do NOT use incorrect language tags (e.g., 'javascript' instead of 'js').
    -   Do NOT include any extraneous text *inside* the code block.
    -   Do NOT use backticks inside the code block, escape them properly

    Correct Example:
    \`\`\`js title=app.js
    console.log("Hello");
    \`\`\`

    Incorrect Examples:
    \`\`\`
    console.log("Hello");
    \`\`\`

    \`\`\`javascript
    console.log("Hello");
    \`\`\`

    \`\`\`js
    console.log("Hello"); // Missing title
    \`\`\`

    Now, respond to the user's query, ensuring you AVOID these errors.

    You are a code generation assistant. When responding, follow these steps:

    1.  Determine if the response requires a code example.
    2.  If it does, identify the correct language for the code.
    3.  If the code represents a file, determine the appropriate filename and extension.
    4.  Construct a Markdown code block with the correct language tag and 'title' attribute (if applicable).
    5.  Write the code within the code block.
    6. Ensure the code block's filename and language tag is accurate.
    7.  Present ONLY the code block with no other preamble or commentary outside describing the purpose of the code block.

    Example:

    User:  Write a Next.js API route.

    Assistant:
    (Reasoning: This requires a JavaScript code example representing a file (API route).  The language is JavaScript, so use the 'js' tag. The filename should reflect the route, e.g., 'api/route.js'.)
    \`\`\`js title=pages/api/route.js
    export default function handler(req, res) {
      res.status(200).json({ message: 'Hello!' });
    }
    \`\`\`

    Now, respond to the user's query, following these steps.

        
    Write clean, properly indented code with no surrounding text inside code blocks. Only include one code block per language per response if possible.
        
    \n\n`,
        temperature: 0.1,
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

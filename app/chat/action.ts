"use server";

import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function fetchChats() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { message: "Authentication required", chats: [] };
    }

    const chats = await prisma.chat.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { chats };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to Fetch chats", chats: [] };
  }
}
export async function improvePrompt(prompt: string) {
  return {
    improved: prompt + " (Improved)", // Replace with Gemini logic later
    reasoning: "Made it more specific and added context.", // Explain improvement
    suggestions: [
      "What is your target audience?",
      "Do you have an expected tone?",
    ], // Suggest more details
  };
}

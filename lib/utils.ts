import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateText } from "./gemini";
import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function generateAndUpdateTitle(id: string, message: string) {
  const title = await generateText(
    `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 40 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons
    - This is the First Message Send by User : ${message}`
  );

  await prisma.chat.update({
    where: { id },
    data: { title },
  });

  console.log("Title generated and updated:", title);

  return title;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to Fetch Data Using Fetcher");
  }

  return res.json();
};

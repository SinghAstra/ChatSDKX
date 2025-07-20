"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { improvePromptSystemPrompt } from "./prompt";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is required.");
}

const model = "gemini-1.5-flash";

export const generateText = async (contents: string) => {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model,
    contents,
  });
  console.log("response.text --generateText is ", response.text);
  return response.text;
};

async function sleep(times: number) {
  console.log(`Sleeping for ${2 * times} seconds...`);
  await new Promise((resolve) => setTimeout(resolve, 2000 * times));
}

export async function improvePrompt(prompt: string, files: string[]) {
  for (let i = 0; i < 100; i++) {
    try {
      const parsedPrompt = `userPrompt : ${prompt},
      ${files.length > 0 && `files for Context: ${files}`}`;
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model,
        contents: parsedPrompt,
        config: {
          systemInstruction: improvePromptSystemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              improved: {
                type: Type.STRING,
              },
              reasoning: {
                type: Type.STRING,
              },
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },
            },
          },
        },
      });

      if (!response.text) {
        throw new Error("Invalid Response improvePrompt");
      }

      const parsed = JSON.parse(response.text);
      console.log("parsed is ", parsed);
      return { success: true, parsed };
    } catch (error) {
      if (error instanceof Error) {
        console.log("--------------------------------");
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
        console.log("--------------------------------");
      }

      if (
        error instanceof Error &&
        error.message.includes("GoogleGenerativeAI Error")
      ) {
        console.log(`Trying again for ${i + 1} time --improvePrompt`);
        sleep(i + 1);
        continue;
      }

      if (
        error instanceof Error &&
        error.message.includes("429 Too Many Requests")
      ) {
        console.log(`Trying again for ${i + 1} time --improvePrompt`);
        sleep(i + 1);
        continue;
      }

      sleep(i + 1);
      continue;
    }
  }
  return { success: false };
}

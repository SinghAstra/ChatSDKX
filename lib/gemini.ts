"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { improvePromptSystemPrompt } from "./prompt";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is required.");
}

const model = "gemini-2.0-flash";

export const generateText = async (contents: string) => {
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model,
    contents,
  });
  console.log("response.text --generateText is ", response.text);
  return response.text;
};

export async function improvePrompt(prompt: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
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
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return {
      message: "Failed to Improve Prompt",
    };
  }
}

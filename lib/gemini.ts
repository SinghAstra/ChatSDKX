import { GoogleGenAI } from "@google/genai";

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

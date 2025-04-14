import { google } from "@ai-sdk/google";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";

export const myProvider = customProvider({
  languageModels: {
    "regular-model": google("gemini-1.5-flash"),
    "reasoning-model": wrapLanguageModel({
      model: google("gemini-1.5-flash"),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": google("gemini-1.5-flash"),
    "artifact-model": google("gemini-1.5-flash"),
  },
});

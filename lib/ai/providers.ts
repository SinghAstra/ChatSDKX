import { google } from "@ai-sdk/google";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { logMiddleware } from "./middleware/log";

export const myProvider = customProvider({
  languageModels: {
    "regular-model": wrapLanguageModel({
      model: google("gemini-1.5-flash"),
      middleware: [logMiddleware],
    }),
    "reasoning-model": wrapLanguageModel({
      model: google("gemini-1.5-flash"),
      middleware: [
        logMiddleware,
        extractReasoningMiddleware({ tagName: "think" }),
      ],
    }),
    "title-model": google("gemini-1.5-flash"),
    "artifact-model": google("gemini-1.5-flash"),
  },
});

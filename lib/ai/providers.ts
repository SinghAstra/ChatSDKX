import { google } from "@ai-sdk/google";
import { customProvider, wrapLanguageModel } from "ai";
import { logMiddleware } from "./middleware/log";

export const myProvider = customProvider({
  languageModels: {
    "regular-model": wrapLanguageModel({
      model: google("gemini-1.5-flash"),
      middleware: [logMiddleware],
    }),
    "title-model": google("gemini-1.5-flash"),
    "artifact-model": google("gemini-1.5-flash"),
  },
});

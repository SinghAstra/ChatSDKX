import { z } from "zod";

export const enhancePromptRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
  chatId: z.string().optional(),
});

export type EnhancePromptInput = z.infer<typeof enhancePromptRequestSchema>;

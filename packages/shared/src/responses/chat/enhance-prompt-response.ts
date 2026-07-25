import { z } from "zod";

export const enhancePromptResponseSchema = z.object({
  enhancedPrompt: z.string(),
});

export type EnhancePromptResponse = z.infer<typeof enhancePromptResponseSchema>;

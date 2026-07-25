import { z } from "zod";

export const enhancePromptResponseSchema = z.object({
  status: z.enum(["improved", "needs_info"]),
  enhancedPrompt: z.string().optional(),
  rationale: z.string().optional(),
  questions: z.array(z.string()).optional(),
});

export type EnhancePromptResponse = z.infer<typeof enhancePromptResponseSchema>;

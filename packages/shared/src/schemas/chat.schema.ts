import { z } from "zod";

export const RoleEnum = z.enum(["USER", "ASSISTANT"]);

// Validates the POST /api/chat/:id/message request body
export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

// Validates the POST /api/prompt/enhance request body
export const enhancePromptSchema = z.object({
  prompt: z.string().min(1, "Prompt is required for enhancement"),
  // Optional: Sending recent chat history helps the AI provide better contextual improvements
  history: z
    .array(
      z.object({
        role: RoleEnum,
        content: z.string(),
      })
    )
    .optional(),
});

// Infer TypeScript types for frontend form submission and backend req.body typing
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type EnhancePromptInput = z.infer<typeof enhancePromptSchema>;

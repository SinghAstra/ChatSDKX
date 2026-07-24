import { z } from "zod";

export const chatSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  updatedAt: z.string(),
});

export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.string().optional(),
});

export const chatThreadSchema = z.object({
  id: z.string(),
  title: z.string(),
  messages: z.array(messageSchema),
});

export const sendMessageResponseSchema = z.object({
  messageId: z.string(),
});

export type ChatSummary = z.infer<typeof chatSummarySchema>;

export type Message = z.infer<typeof messageSchema>;

export type ChatThread = z.infer<typeof chatThreadSchema>;

export type SendMessageResponse = z.infer<typeof sendMessageResponseSchema>;

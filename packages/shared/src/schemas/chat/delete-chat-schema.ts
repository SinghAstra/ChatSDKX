import { z } from "zod";

export const deleteChatParamsSchema = z.object({
  id: z.string().min(1, "Chat ID is required"),
});

export type DeleteChatParams = z.infer<typeof deleteChatParamsSchema>;

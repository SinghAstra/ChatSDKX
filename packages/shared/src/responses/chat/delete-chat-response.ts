import { z } from "zod";

export const deleteChatPayloadSchema = z.object({
  message: z.string(),
});

export type DeleteChatPayload = z.infer<typeof deleteChatPayloadSchema>;

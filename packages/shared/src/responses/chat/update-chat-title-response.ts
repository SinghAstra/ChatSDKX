import { z } from "zod";

export const updateChatTitleResponseSchema = z.object({
  success: z.boolean(),
});

export type UpdateChatTitleResponse = z.infer<
  typeof updateChatTitleResponseSchema
>;

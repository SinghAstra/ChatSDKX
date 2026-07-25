import { z } from "zod";

export const updateChatTitleRequestSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title must be 100 characters or less"),
});

export type UpdateChatTitleInput = z.infer<typeof updateChatTitleRequestSchema>;

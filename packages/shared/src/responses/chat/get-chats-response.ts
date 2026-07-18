import { z } from "zod";
import { chatBaseSchema } from "./chat-base";

export const getChatsPayloadSchema = z.array(chatBaseSchema);

export type GetChatsPayload = z.infer<typeof getChatsPayloadSchema>;

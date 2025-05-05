import { ClientMessage } from "@/hooks/use-message";
import { ChatAction } from "./chat.types";

export const setChatMessages = (
  messages: ClientMessage[],
  chatId: string
): ChatAction => ({
  type: "SET_MESSAGES",
  payload: { chatId, messages },
});

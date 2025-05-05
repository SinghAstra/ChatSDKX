import { ClientMessage } from "@/hooks/use-message";

export interface ChatState {
  chatMessages: {
    [chatId: string]: {
      messages: ClientMessage[];
    };
  };
}

export type ChatAction =
  | {
      type: "SET_MESSAGES";
      payload: { chatId: string; messages: ClientMessage[] };
    }
  | {
      type: "APPEND_MESSAGE";
      payload: { chatId: string; message: ClientMessage };
    }
  | {
      type: "UPDATE_STREAMING_MESSAGE";
      payload: { chatId: string; contentChunk: string };
    }
  | { type: "FINALIZE_STREAMING_MESSAGE"; payload: { chatId: string } };

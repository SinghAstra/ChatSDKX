import { ChatAction, ChatState } from "./chat.types";

export const initialState: ChatState = {
  chatMessages: {},
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_MESSAGES": {
      const { chatId, messages } = action.payload;
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [chatId]: {
            messages,
          },
        },
      };
    }

    case "APPEND_MESSAGE": {
      const { chatId, message } = action.payload;
      const chat = state.chatMessages[chatId] || {
        messages: [],
        isStreaming: false,
      };
      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [chatId]: {
            ...chat,
            messages: [...chat.messages, message],
          },
        },
      };
    }

    case "UPDATE_STREAMING_MESSAGE": {
      const { chatId, contentChunk } = action.payload;
      const chat = state.chatMessages[chatId];
      if (!chat) return state;

      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [chatId]: {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.isStreaming
                ? { ...msg, content: msg.content + contentChunk }
                : msg
            ),
          },
        },
      };
    }

    case "FINALIZE_STREAMING_MESSAGE": {
      const chat = state.chatMessages[action.payload.chatId];
      if (!chat) return state;

      return {
        ...state,
        chatMessages: {
          ...state.chatMessages,
          [action.payload.chatId]: {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.isStreaming
                ? {
                    ...msg,
                    id: crypto.randomUUID(),
                    isStreaming: false,
                  }
                : msg
            ),
          },
        },
      };
    }

    default:
      return state;
  }
}

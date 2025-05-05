import { ClientMessage } from "@/hooks/use-message";
import { Role } from "@prisma/client";
import { createContext, ReactNode, useContext, useReducer } from "react";
import { chatReducer, initialState } from "./chat.reducer";
import { ChatAction, ChatState } from "./chat.types";

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (input: string, chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = async (input: string, chatId: string) => {
    const userMessage: ClientMessage = {
      id: crypto.randomUUID(),
      role: Role.user,
      content: input,
    };
    const streamingMessage: ClientMessage = {
      id: "streaming",
      role: Role.model,
      content: "",
      isStreaming: true,
    };

    dispatch({
      type: "APPEND_MESSAGE",
      payload: { chatId, message: userMessage },
    });
    dispatch({
      type: "APPEND_MESSAGE",
      payload: { chatId, message: streamingMessage },
    });

    const res = await fetch(`/api/chat/${chatId}/ask`, {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      dispatch({
        type: "UPDATE_STREAMING_MESSAGE",
        payload: { chatId, contentChunk: chunk },
      });
    }

    dispatch({ type: "FINALIZE_STREAMING_MESSAGE", payload: { chatId } });
  };

  console.log(
    "Object.entries(state.chatMessages).length is ",
    Object.entries(state.chatMessages).length
  );
  Object.entries(state.chatMessages).map((key) => {
    console.log("key is ", key[0]);
  });

  return (
    <ChatContext.Provider value={{ state, dispatch, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

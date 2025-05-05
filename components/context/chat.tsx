"use client";

import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

export type ClientMessage = {
  id: string;
  role: Role;
  content: string;
  isStreaming?: boolean;
};

interface ChatContextType {
  messages: ClientMessage[];
  sendMessage: (input: string, chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({
  children,
  initialMessages = [],
}: {
  children: ReactNode;
  initialMessages?: ClientMessage[];
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const router = useRouter();

  const sendMessage = async (input: string, chatId: string) => {
    const userMessage: ClientMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };
    const modelMessage: ClientMessage = {
      id: "streaming",
      role: "model",
      content: "",
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, modelMessage]);

    const res = await fetch(`/api/chat/${chatId}/ask`, {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    if (!res.ok || !res.body) {
      setErrorMessage("Could Not Send AI Request.");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    router.push(`/chat/${chatId}`);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "streaming"
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      );
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "streaming"
          ? { ...msg, id: crypto.randomUUID(), isStreaming: false }
          : msg
      )
    );
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }
    toast(errorMessage);
    setErrorMessage(null);
  }, [errorMessage]);

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};

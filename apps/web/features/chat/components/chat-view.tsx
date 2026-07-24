"use client";

import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInputForm } from "@/features/chat/components/chat-input-form";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

interface ChatViewProps {
  chatId?: string;
  initialMessages?: Message[];
}

export function ChatView({ chatId, initialMessages = [] }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const [isStreaming, setIsStreaming] = useState(false);

  const [editingPrompt, setEditingPrompt] = useState<string>("");

  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  const handleStopStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);

      streamIntervalRef.current = null;
    }

    setIsStreaming(false);
  };

  const handleSendMessage = async (prompt: string) => {
    setIsStreaming(true);

    setEditingPrompt("");

    // Optimistic Update
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: "" }, // Thinking state
    ]);

    // If it's a new chat, simulate a generated ID for the URL
    if (!chatId) {
      const newChatId = `chat_${Math.random().toString(36).substring(2, 9)}`;

      window.history.pushState(null, "", `/chat/${newChatId}`);
    }

    // Error simulation check
    const shouldSimulateError = prompt.toLowerCase().includes("error");

    setTimeout(() => {
      if (shouldSimulateError) {
        setIsStreaming(false);

        setMessages((prev) => {
          const newMessages = [...prev];

          const lastIndex = newMessages.length - 1;

          newMessages[lastIndex] = {
            role: "assistant",
            content: "",
            isError: true,
          };

          return newMessages;
        });

        return;
      }

      const simulatedReply = `
I received your message${chatId ? ` in session \`${chatId}\`` : ""}:

> "${prompt}"

\`\`\`typescript
export const chatConfig = {
  version: "1.0.0",
  status: "active"
};
\`\`\`

Everything is running smoothly!
`;

      let currentIndex = 0;

      const chunkSize = 5;

      streamIntervalRef.current = setInterval(() => {
        if (currentIndex < simulatedReply.length) {
          const nextChunk = simulatedReply.slice(
            currentIndex,
            currentIndex + chunkSize
          );

          setMessages((prev) => {
            const newMessages = [...prev];

            const lastMessageIndex = newMessages.length - 1;

            newMessages[lastMessageIndex] = {
              ...newMessages[lastMessageIndex],
              content: newMessages[lastMessageIndex].content + nextChunk,
            };

            return newMessages;
          });

          currentIndex += chunkSize;
        } else {
          handleStopStreaming();
        }
      }, 20);
    }, 1200);
  };

  const handleEditMessage = (content: string) => {
    setEditingPrompt(content);
  };

  const handleRetryMessage = () => {
    setMessages((prev) => {
      const lastUserMsg = prev[prev.length - 2];

      const sliced = prev.slice(0, prev.length - 2);

      if (lastUserMsg) {
        handleSendMessage(lastUserMsg.content);
      }

      return sliced;
    });
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        <div
          className={`flex flex-col w-full max-w-4xl mx-auto p-4 flex-1 ${
            messages.length === 0 ? "justify-center" : "justify-start"
          }`}
        >
          {messages.length === 0 ? (
            <ChatEmptyState onSelectPrompt={handleSendMessage} />
          ) : (
            <ChatMessageList
              messages={messages}
              onEditMessage={handleEditMessage}
              onRetryMessage={handleRetryMessage}
            />
          )}
        </div>
      </div>

      <div className="w-full shrink-0 p-1">
        <div className="w-full max-w-4xl mx-auto ">
          <ChatInputForm
            chatId={chatId}
            initialValue={editingPrompt}
            onSubmit={handleSendMessage}
            isStreaming={isStreaming}
            onStop={handleStopStreaming}
          />
        </div>
      </div>
    </div>
  );
}

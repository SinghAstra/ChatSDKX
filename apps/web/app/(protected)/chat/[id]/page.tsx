"use client";

import { ChatInputForm } from "@/features/chat/components/chat-input-form";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { useState, useRef, useEffect, use } from "react";

interface ChatThreadPageProps {
  params: Promise<{ id: string }>;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

export default function ChatThreadPage({ params }: ChatThreadPageProps) {
  const resolvedParams = use(params);

  const chatId = resolvedParams.id;

  // Mock initial history using strict role types
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      content: `Hello! Can you help me with thread ID: ${chatId}?`,
    },
    {
      role: "assistant",
      content: `Welcome back to thread **${chatId}**. I have loaded your historical conversation successfully. Type something with the word **"error"** to test the failure and retry state!`,
    },
  ]);

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

    setEditingPrompt(""); // Reset edit state on submit

    // 1. Optimistic Update
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: "" }, // Thinking state
    ]);

    // Check if user prompt triggers an intentional error simulation
    const shouldSimulateError = prompt.toLowerCase().includes("error");

    console.log("prompt.toLowerCase() is ", prompt.toLowerCase());

    setTimeout(() => {
      if (shouldSimulateError) {
        // Simulate an API failure state
        setIsStreaming(false);

        setMessages((prev) => {
          const newMessages = [...prev];

          const lastIndex = newMessages.length - 1;

          newMessages[lastIndex] = {
            role: "assistant",
            content: "",
            isError: true, // Trigger error UI & Retry button
          };

          return newMessages;
        });

        return;
      }

      // Normal successful stream simulation
      const simulatedReply = `
I received your message in chat session \`${chatId}\`:

> "${prompt}"

Here is a quick markdown code example to verify formatting on existing threads:

\`\`\`typescript
export async function fetchChatSession(id: string) {
  console.log("Fetching session:", id);
  return { success: true, chatId: id };
}
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
        <div className="flex flex-col w-full max-w-4xl mx-auto p-4 flex-1 justify-start">
          <ChatMessageList
            messages={messages}
            onEditMessage={handleEditMessage}
            onRetryMessage={handleRetryMessage}
          />
        </div>
      </div>

      <div className="w-full bg-background shrink-0">
        <div className="w-full max-w-4xl mx-auto p-4">
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

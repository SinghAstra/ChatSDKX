"use client";

import { ChatInputForm } from "@/features/chat/components/chat-input-form";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { useState, useRef, useEffect, use } from "react";

interface ChatThreadPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatThreadPage({ params }: ChatThreadPageProps) {
  const resolvedParams = use(params);

  const chatId = resolvedParams.id;

  // Mock initial history based on the chatId
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "user",
        content: `Hello! Can you help me with thread ID: ${chatId}?`,
      },
      {
        role: "assistant",
        content: `Welcome back to thread **${chatId}**. I have loaded your historical conversation successfully. How can I assist you further today?`,
      },
    ]
  );

  const [isStreaming, setIsStreaming] = useState(false);

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

    // 1. Optimistic Update
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: "" }, // Thinking state
    ]);

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

    setTimeout(() => {
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

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        <div className="flex flex-col w-full max-w-4xl mx-auto p-4 flex-1 justify-start">
          <ChatMessageList messages={messages} />
        </div>
      </div>

      <div className="w-full bg-background shrink-0">
        <div className="w-full max-w-4xl mx-auto p-4">
          <ChatInputForm
            chatId={chatId}
            onSubmit={handleSendMessage}
            isStreaming={isStreaming}
            onStop={handleStopStreaming}
          />
        </div>
      </div>
    </div>
  );
}

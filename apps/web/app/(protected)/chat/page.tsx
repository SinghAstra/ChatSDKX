"use client";

import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInputForm } from "@/features/chat/components/chat-input-form";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; isError?: boolean }[]
  >([]);

  const [isStreaming, setIsStreaming] = useState(false);

  const [editingPrompt, setEditingPrompt] = useState<string>("");

  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval if the component unmounts mid-stream
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

  const handleNewChatSubmit = async (prompt: string) => {
    setIsStreaming(true);

    setEditingPrompt(""); // Reset edit state on submit

    // 1. Optimistic Update
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: "" },
    ]);

    // 2. Simulate ID generation
    const newChatId = `chat_${Math.random().toString(36).substring(2, 9)}`;

    window.history.pushState(null, "", `/chat/${newChatId}`);

    const markdownSimulation = `
# Markdown Rendering Test

This is a simulated response to demonstrate the capabilities of your new **MarkdownRenderer**. 

## Code Formatting
Here is a practical example of a React component written in TypeScript:

\`\`\`tsx
import React, { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border rounded-md">
      <p>Current count: {count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

### Task List
1. Sent message optimistically.
2. Updated URL via shallow routing.
3. Rendered Markdown response.
4. Test the stop button & polish features!
`;

    // Wait 1.5 seconds in "Thinking..." mode before streaming
    setTimeout(() => {
      let currentIndex = 0;

      const chunkSize = 5;

      streamIntervalRef.current = setInterval(() => {
        if (currentIndex < markdownSimulation.length) {
          const nextChunk = markdownSimulation.slice(
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
    }, 1500);
  };

  const handleEditMessage = (content: string) => {
    setEditingPrompt(content);
  };

  const handleRetryMessage = () => {
    // Remove the last error assistant message and re-trigger submission with the previous user prompt
    setMessages((prev) => {
      const lastUserMsg = prev[prev.length - 2];

      const sliced = prev.slice(0, prev.length - 2);

      if (lastUserMsg) {
        handleNewChatSubmit(lastUserMsg.content);
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
            <ChatEmptyState />
          ) : (
            <ChatMessageList
              messages={messages}
              onEditMessage={handleEditMessage}
              onRetryMessage={handleRetryMessage}
            />
          )}
        </div>
      </div>

      <div className="w-full bg-background shrink-0">
        <div className="w-full max-w-4xl mx-auto p-4">
          <ChatInputForm
            initialValue={editingPrompt}
            onSubmit={handleNewChatSubmit}
            isStreaming={isStreaming}
            onStop={handleStopStreaming}
          />
        </div>
      </div>
    </div>
  );
}

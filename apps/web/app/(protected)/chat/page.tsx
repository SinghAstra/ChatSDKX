"use client";

import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInputForm } from "@/features/chat/components/chat-input-form";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const handleNewChatSubmit = async (prompt: string) => {
    // 1. Optimistic Update: Push User Message AND an empty AI Message for the "Thinking" state
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "assistant", content: "" }, // Empty content triggers TextShine
    ]);

    // 2. Simulate ID generation & Shallow Routing
    // const newChatId = `chat_${Math.random().toString(36).substring(2, 9)}`;
    // window.history.pushState(null, "", `/chat/${newChatId}`);

    // 3. The exact Markdown string to stream
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
4. Test the copy buttons!
`;

    // 4. Simulate network latency (thinking time), then start streaming
    setTimeout(() => {
      let currentIndex = 0;

      const chunkSize = 5; // How many characters to push per tick

      const streamInterval = setInterval(() => {
        if (currentIndex < markdownSimulation.length) {
          // Grab the next chunk of characters
          const nextChunk = markdownSimulation.slice(
            currentIndex,
            currentIndex + chunkSize
          );

          setMessages((prev) => {
            const newMessages = [...prev];

            const lastMessageIndex = newMessages.length - 1;

            // Append chunk to the last message (the AI message)
            newMessages[lastMessageIndex] = {
              ...newMessages[lastMessageIndex],
              content: newMessages[lastMessageIndex].content + nextChunk,
            };

            return newMessages;
          });

          currentIndex += chunkSize;
        } else {
          // Stop streaming when we reach the end of the string
          clearInterval(streamInterval);
        }
      }, 20); // Push a chunk every 20ms
    }, 1500); // Wait 1.5 seconds in "Thinking..." mode before streaming
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
            <ChatMessageList messages={messages} />
          )}
        </div>
      </div>

      <div className="w-full bg-background shrink-0">
        <div className="w-full max-w-4xl mx-auto p-4">
          <ChatInputForm onSubmit={handleNewChatSubmit} />
        </div>
      </div>
    </div>
  );
}

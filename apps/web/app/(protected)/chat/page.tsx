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
    // 1. Optimistic Update
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    // 2. Simulate ID generation
    const newChatId = `chat_${Math.random().toString(36).substring(2, 9)}`;

    // 3. Shallow Routing
    window.history.pushState(null, "", `/chat/${newChatId}`);

    // 4. Simulate the AI responding
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "This is a simulated response. In the future, this will stream live from Gemini!",
        },
      ]);
    }, 1000);
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

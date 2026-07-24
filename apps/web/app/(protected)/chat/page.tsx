"use client";

import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInputForm } from "@/features/chat/components/chat-input-form";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const handleNewChatSubmit = async (prompt: string) => {
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    const newChatId = `chat_${Math.random().toString(36).substring(2, 9)}`;

    window.history.pushState(null, "", `/chat/${newChatId}`);

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
    <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto overflow-hidden">
      <div
        className={`flex flex-col flex-1 overflow-y-auto p-4 ${
          messages.length === 0 ? "justify-center" : "justify-start"
        }`}
      >
        {messages.length === 0 ? (
          <ChatEmptyState />
        ) : (
          <div className="flex flex-col space-y-4 pb-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl text-[15px] max-w-[85%] ${
                  m.role === "user"
                    ? "bg-foreground text-background self-end rounded-br-sm"
                    : "bg-muted/50 border border-border/50 text-foreground self-start rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-background shrink-0">
        <ChatInputForm onSubmit={handleNewChatSubmit} />
      </div>
    </div>
  );
}

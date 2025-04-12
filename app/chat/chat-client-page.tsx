"use client";

import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { generateID } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { Visibility } from "@prisma/client";
import { UIMessage } from "ai";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ModelSelector } from "./model-selector";
import { SidebarToggle } from "./sidebar-toggle";
import { VisibilitySelector } from "./visibility-selector";

interface ChatClientPageProps {
  id: string;
  initialMessages: UIMessage[];
  isReadOnly: boolean;

  chatModel: string;
  chatVisibility: Visibility;
}

const ChatClientPage = ({
  chatModel,
  chatVisibility,
  id,
  initialMessages,
  isReadOnly,
}: ChatClientPageProps) => {
  const { open, setOpen } = useSidebar();
  const [message, setMessage] = useState<string | null>(null);

  const { messages, handleSubmit, input, setInput, status } = useChat({
    id,
    body: { id, chatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateID,
    onError: (error) => {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage(error.message || "An error occurred, please try again!");
    },
  });

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  return (
    <div className="h-screen flex flex-col w-full">
      <div className="flex items-center gap-2 p-2">
        <div className="flex items-center gap-2">
          <SidebarToggle />{" "}
          {!open && (
            <span
              className="text-lg font-medium cursor-pointer"
              onClick={() => setOpen(true)}
            >
              {siteConfig.name}
            </span>
          )}
        </div>
        {!isReadOnly && <ModelSelector chatModel={chatModel} />}
        {!isReadOnly && <VisibilitySelector chatVisibility={chatVisibility} />}
      </div>
      <div className="flex-1 flex flex-col p-4 overflow-y-auto ">
        <div className="flex flex-col gap-2 mb-4">
          {messages.map((message) => (
            <div key={message.id} className="whitespace-pre-wrap">
              {message.role === "user" ? "User: " : "AI: "}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                }
              })}
            </div>
          ))}
        </div>
        {!isReadOnly && (
          <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-md px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md px-4 py-2 text-sm"
              disabled={status === "streaming" || !input.trim()}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatClientPage;

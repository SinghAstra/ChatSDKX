"use client";

import { useChat } from "@/components/context/chat";
import FadeSlideIn from "@/components/global/fade-slide-in";
import { AvatarMenu } from "@/components/ui/avatar-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { generateID } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createChat } from "./action";
import { SidebarToggle } from "./sidebar-toggle";

interface NewChatClientPageProps {
  user: User;
}

const NewChatClientPage = ({ user }: NewChatClientPageProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { open, setOpen } = useSidebar();
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const id = generateID();
  const { sendMessage } = useChat();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { chat } = await createChat(input, id);

    if (!chat) {
      setMessage("Could Not Create Chat.");
      return;
    }
    sendMessage(input, id);
    // Navigate to /chat/:id
    router.push(`/chat/${chat.id}`);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  return (
    <div className="h-screen flex flex-col w-full ">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3 w-full">
          <div className="flex items-center gap-3">
            <SidebarToggle />
            {!open && (
              <div
                className="text-lg font-bold cursor-pointer animate-fade-in"
                onClick={() => setOpen(true)}
              >
                {siteConfig.name}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <AvatarMenu user={user} />
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto pb-24 max-w-5xl mx-auto w-full">
        <FadeSlideIn
          delay={0.2}
          className="flex flex-col items-center justify-center h-full text-center"
        >
          <div className="bg-primary/10 p-6 rounded-full mb-4">
            <Bot className="h-12 w-12 text-primary" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">
              Start a new conversation
            </h2>
            <p className="text-muted-foreground max-w-md">
              Type a message below to begin chatting with the AI assistant.
            </p>
          </div>
        </FadeSlideIn>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 inset-x-0 bg-background/80 backdrop-blur-md p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-lg border overflow-hidden">
            <form onSubmit={handleFormSubmit} className="flex items-center">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-6 px-4"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 mr-2"
              >
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className={`rounded-full ${
                    !input.trim() ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            </form>
          </Card>
          <p className="text-xs text-center text-muted-foreground mt-2">
            AI responses are generated and may not always be accurate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewChatClientPage;

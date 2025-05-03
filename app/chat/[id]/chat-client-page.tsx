"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { Message, Role } from "@prisma/client";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SidebarToggle } from "../sidebar-toggle";

interface ChatClientPageProps {
  messages: Message[];
}

const ChatClientPage = ({ messages }: ChatClientPageProps) => {
  const { open, setOpen } = useSidebar();
  const [message, setMessage] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams();

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // When a new Input Comes we should save the message in db ,
    // reflect the changes in frontend & then stream the response
    // Should a new user message be created in /ask or new api route or server action ?
    // Where and why ?
    // How to save model response in db ?
    setResponse("");

    const res = await fetch(`/api/chat/${params.id}/ask`, {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      if (!reader) {
        setMessage("Reader is undefined");
        return;
      }
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      setResponse((prev) => prev + chunk);
    }
  };

  return (
    <div className="h-screen flex flex-col w-full relative">
      <div className="flex items-center gap-2 p-2 sticky top-0 inset-x-0">
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
      </div>
      <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-12">
        <div className="flex flex-col gap-2 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`whitespace-pre-wrap border rounded-md p-2 max-w-[60%] ${
                message.role === Role.user
                  ? "self-end bg-muted text-muted-foreground"
                  : "self-start bg-muted/40 text-foreground"
              }`}
            >
              {message.content}
            </div>
          ))}
          {response && (
            <div
              className={`whitespace-pre-wrap border rounded-md p-2 max-w-[60%] 
                  "self-start bg-muted/40 text-foreground"
              }`}
            >
              {response}
            </div>
          )}
        </div>
      </div>
      <div className="sticky bottom-0 inset-x-0  backdrop-blur-md p-2">
        <div className="max-w-5xl mx-auto">
          <div className="shadow-lg border overflow-hidden rounded-md">
            <form onSubmit={handleSubmit} className="flex items-center">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatClientPage;

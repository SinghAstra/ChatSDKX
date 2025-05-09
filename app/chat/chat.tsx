"use client";

import { AvatarMenu } from "@/components/ui/avatar-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import useMessages, { ClientMessage } from "@/hooks/use-message";
import { Role } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, Send } from "lucide-react";
import { User } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Markdown } from "./[id]/markdown";
import { SidebarToggle } from "./sidebar-toggle";

interface ChatProps {
  user: User;
  initialMessages: ClientMessage[];
  chatId: string;
  newChat: boolean;
}

const Chat = ({ user, initialMessages, chatId, newChat }: ChatProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { open, setOpen } = useSidebar();
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useMessages(initialMessages, chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setInput("");
    scrollToBottom();
    sendMessage(input);
    // Navigate to /chat/:id
    if (newChat) {
      console.log("Navigated to /chat/:id");
      window.history.replaceState({}, "", `/chat/${chatId}`);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      { threshold: 0.8 }
    );

    const val = messagesEndRef.current;

    if (val) {
      observer.observe(val);
    }

    return () => {
      if (val) {
        observer.unobserve(val);
      }
    };
  }, []);

  useEffect(() => {
    const newVal = searchParams.get("new");
    if (newVal) {
      const params = new URLSearchParams(searchParams.toString());

      // Remove the "deleteKey" param
      params.delete("new");

      // Update the URL without reloading
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col w-full relative overflow-x-hidden ">
      <div
        className={`flex items-center justify-between  p-2 fixed ${
          open ? "left-[16rem]" : "left-0"
        } top-0 right-0 bg-muted/40 z-[99]`}
      >
        <div className="flex items-center gap-2 ">
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
        <div className="flex items-center gap-3">
          <AvatarMenu user={user} />
        </div>
      </div>

      {/* Chat Area */}
      {messages.length === 0 ? (
        <div
          // delay={0.2}
          className="flex flex-col  gap-4 items-center justify-center  text-center max-w-3xl mx-auto w-full min-h-screen"
        >
          <div className="bg-primary/10 p-6 rounded-full">
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
          {/* Input Area */}
          <div className=" w-full mx-auto shadow-lg rounded-md  border border-purple-400">
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
          </div>
        </div>
      ) : (
        <div
          className="flex-1 flex gap-2 flex-col px-2 overflow-y-auto pb-32 pt-16 relative overflow-x-hidden"
          ref={messagesRef}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`whitespace-pre-line overflow-hidden  border rounded-md p-2 max-w-[60%] ${
                message.role === Role.user
                  ? "self-end bg-muted/40 text-foreground/70"
                  : "self-start bg-muted/20 text-foreground"
              }`}
            >
              <Markdown>{message.content}</Markdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
          <AnimatePresence>
            {showScrollButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.3 }}
                onClick={scrollToBottom}
                className="fixed bottom-20 right-4 bg-muted text-muted-foreground rounded-full p-2 shadow-lg z-50"
                aria-label="Scroll to bottom"
              >
                <motion.div
                  animate={{ y: [0, 3, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                  }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>
          <div
            className={`fixed z-[20] bottom-0 right-0 ${
              open ? "left-[16rem]" : "left-0"
            }  bg-muted/40 p-2`}
          >
            <div className="max-w-5xl mx-auto bg-background rounded-md">
              <div className="shadow-lg border overflow-hidden rounded-md">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

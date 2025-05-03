"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import useMessages from "@/hooks/use-message";
import { Message, Role } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Send } from "lucide-react";
import { useParams } from "next/navigation";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SidebarToggle } from "../sidebar-toggle";
import { Markdown } from "./markdown";

interface ChatClientPageProps {
  initialMessages: Message[];
}

const ChatClientPage = ({ initialMessages }: ChatClientPageProps) => {
  const { open, setOpen } = useSidebar();
  const [message, setMessage] = useState<string | null>(null);
  const [input, setInput] = useState(
    "I am newbie so i want to take my time while building mvp of linux give me topic that i should and code to write for building mvp of linux"
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const { messages, sendMessage } = useMessages(
    initialMessages,
    params.id as string
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  console.log("messages.length is ", messages.length);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  const handleFormSubmit = (e: FormEvent) => {
    console.log("in handleFormSubmit");
    e.preventDefault();
    console.log("input is ", input);
    console.log("!input || !input.trim() is ", !input || !input.trim());
    if (input.trim()) {
      setAutoScroll(true);
      sendMessage(input);
    }
  };

  const scrollToBottom = () => {
    setAutoScroll(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoScroll(entry.isIntersecting);
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
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  return (
    <div className="ṃin-h-screen flex flex-col w-full relative overflow-x-hidden">
      <div
        className={`flex items-center gap-2 p-2 fixed ${
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
      </div>
      <div
        className="flex-1 flex gap-2 flex-col p-4 overflow-y-auto pb-12 pt-16 relative overflow-x-hidden"
        ref={messagesRef}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`whitespace-pre-wrap border rounded-md p-2 max-w-[60%] ${
              message.role === Role.user
                ? "self-end bg-muted text-muted-foreground"
                : "self-start bg-muted/40 text-foreground"
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
              className="fixed bottom-20 right-12 bg-muted text-muted-foreground rounded-full p-2 shadow-lg z-50"
              aria-label="Scroll to bottom"
            >
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
                <ChevronDown size={20} />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div
        className={`fixed bottom-0 right-0 ${
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
  );
};

export default ChatClientPage;

"use client";

import FadeSlideIn from "@/components/global/fade-slide-in";
import { AvatarMenu } from "@/components/ui/avatar-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { generateID } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import type { Visibility } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createChat } from "./action";
import { SidebarToggle } from "./sidebar-toggle";
import { VisibilitySelector } from "./visibility-selector";

interface NewChatClientPageProps {
  id: string;
  chatVisibility: Visibility;
  user: User;
}

const NewChatClientPage = ({
  chatVisibility,
  id,
  user,
}: NewChatClientPageProps) => {
  const { open, setOpen } = useSidebar();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  // const messagesEndRef = useRef<HTMLDivElement>(null);
  const [visibilityChanged, setVisibilityChanged] = useState(false);

  const { handleSubmit, input, setInput, status } = useChat({
    id,
    body: { id },
    initialMessages: [],
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

  // Auto-focus input on page load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when new messages arrive
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  useEffect(() => {
    if (!message) return;
    toast(message);
    setMessage(null);
  }, [message]);

  // Handle visibility change animation
  useEffect(() => {
    if (visibilityChanged) {
      const timer = setTimeout(() => setVisibilityChanged(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [visibilityChanged]);

  const handleCustomSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await createChat(id, input);
    router.push(`/chat/${id}`);
    handleSubmit(e);
  };

  const handleVisibilityChange = () => {
    setVisibilityChanged(true);
  };

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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVisibilityChange}
              className="cursor-pointer"
            >
              <VisibilitySelector chatVisibility={chatVisibility} />
            </motion.div>

            <AvatarMenu user={user} />
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto pb-24 max-w-5xl mx-auto w-full">
        {/* {messages.length === 0 ? ( */}
        <FadeSlideIn
          delay={0.2}
          className="flex flex-col items-center justify-center h-full text-center"
        >
          <div className="bg-primary/10 p-6 rounded-full mb-4">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Start a new conversation</h2>
          <p className="text-muted-foreground max-w-md">
            Type a message below to begin chatting with the AI assistant.
          </p>
        </FadeSlideIn>
        {/* ) : (
        <div className="flex flex-col gap-6 mb-4">
          <FadeSlideIn >
            {messages.map((message) => {
              const timestamp = new Date(message.createdAt || Date.now());
              const isUser = message.role === "user";

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        isUser ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      {isUser ? (
                        <UserIcon className="h-4 w-4 text-primary-foreground" />
                      ) : (
                        <Bot className="h-4 w-4 text-secondary-foreground" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div
                        className={`whitespace-pre-wrap p-4 rounded-2xl ${
                          isUser
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-card text-card-foreground rounded-tl-none shadow-sm border"
                        }`}
                      >
                        {message.parts.map((part, i) => {
                          switch (part.type) {
                            case "text":
                              return (
                                <div key={`${message.id}-${i}`}>
                                  {part.text}
                                </div>
                              );
                          }
                        })}
                      </div>
                      <span
                        className={`text-xs text-muted-foreground ${
                          isUser ? "text-right" : "text-left"
                        }`}
                      >
                        {formatDistanceToNow(timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </Fade>

          {status === "streaming" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <div className="flex gap-1">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="h-2 w-2 bg-primary rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                  className="h-2 w-2 bg-primary rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                  className="h-2 w-2 bg-primary rounded-full"
                />
              </div>
              <span className="text-sm">AI is typing...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
        )} */}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 inset-x-0 bg-background/80 backdrop-blur-md p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-lg border overflow-hidden">
            <form onSubmit={handleCustomSubmit} className="flex items-center">
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
                  disabled={status === "streaming" || !input.trim()}
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

      {/* Visibility change animation */}
      <AnimatePresence>
        {visibilityChanged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-primary/20 rounded-full p-8">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.6 }}
              >
                {chatVisibility === "public" ? (
                  <span className="text-4xl">🌎</span>
                ) : (
                  <span className="text-4xl">🔒</span>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewChatClientPage;

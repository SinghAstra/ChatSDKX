"use client";

import Dialog from "@/components/componentX/dialog";
import { useToastContext } from "@/components/providers/toast";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import useMessages from "@/hooks/use-message";
import { improvePrompt } from "@/lib/gemini";
import type { ClientMessage } from "@/lib/types";
import { Role } from "@prisma/client";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle, X } from "lucide-react";
import type { User } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createChatInDB } from "./[id]/action";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import { MessageContent } from "./message-content";
import ReasoningToast from "./prompt-reasoning";

interface ChatProps {
  user: User;
  initialMessages: ClientMessage[];
  chatId: string;
  newChat: boolean;
}

const Chat = ({ user, initialMessages, chatId, newChat }: ChatProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { open, setOpen } = useSidebar();
  const [input, setInput] = useState("");
  const { messages, sendMessage, isStreaming } = useMessages(
    initialMessages,
    chatId
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState<string | null>(null);
  const [improvementReason, setImprovementReason] = useState<string | null>(
    null
  );
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isNewChat, setIsNewChat] = useState(newChat);
  const [reRenderIO, setReRenderIO] = useState(false);
  const [isSuggestedQuestionDialogOpen, setIsSuggestedQuestionDialogOpen] =
    useState(false);

  const { setToastMessage } = useToastContext();

  const handleImprovePrompt = async () => {
    setIsImprovingPrompt(true);
    setOriginalPrompt(input);
    const { success, parsed } = await improvePrompt(input, filePreviews);
    if (success) {
      setInput(parsed.improved);
      setImprovementReason(parsed.reasoning);
      setSuggestedQuestions(parsed.suggestions);
    } else {
      setToastMessage("Failed to Improve Prompt. Please try again later.");
    }
    setIsImprovingPrompt(false);
  };

  const handleUndoImprove = () => {
    if (originalPrompt !== null) {
      setInput(originalPrompt);
      setOriginalPrompt(null);
      setImprovementReason(null);
      setSuggestedQuestions([]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    if (originalPrompt !== null && value !== input) {
      setOriginalPrompt(null);
    }
    setInput(value);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasteData = event.clipboardData.getData("text");
    event.preventDefault();

    if (pasteData.length > 1500) {
      if (filePreviews.includes(pasteData)) {
        setToastMessage("File Already Copied.");
        return;
      }
      setFilePreviews((prev) => [...prev, pasteData]);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !isStreaming &&
      !isImprovingPrompt
    ) {
      e.preventDefault();
      await handleInputSubmitReset();
    }
  };

  const handleInputSubmitReset = async () => {
    if (!input.trim()) return;
    const fullMessage = [...filePreviews, input].join("\n\n");
    if (isNewChat) {
      await createChatInDB(chatId, user.id, fullMessage);
    }
    sendMessage(fullMessage);
    setSuggestedQuestions([]);
    setInput("");
    setOriginalPrompt(null);
    setFilePreviews([]);
    scrollToBottom();
    if (isNewChat) {
      window.history.replaceState({}, "", `/chat/${chatId}`);
      setIsNewChat(false);
      setReRenderIO(true);
    }
  };

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleInputSubmitReset();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log("entry.isIntersecting is ", entry.isIntersecting);
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
  }, [reRenderIO]);

  useEffect(() => {
    const newVal = searchParams.get("new");
    if (newVal) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("new");
      router.replace(`?${params.toString()}`, { scroll: false });
      setIsNewChat(true);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  console.log("messages.length is ", messages.length);

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <ChatHeader open={open} setOpen={setOpen} user={user} />

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center  max-w-4xl mx-auto w-full px-2 sm:px-4 text-center">
          {suggestedQuestions.length > 0 && (
            <Button
              onClick={() =>
                setIsSuggestedQuestionDialogOpen(!isSuggestedQuestionDialogOpen)
              }
              variant="outline"
              className="gap-2 mb-4 rounded bg-muted/40 hover:bg-muted/60 transition-all duration-200"
            >
              <HelpCircle className="w-3 h-3" />
              <span>View Suggestions</span>
            </Button>
          )}
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">
              How can I assist you today?
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Start a conversation or paste content to get started
            </p>
          </div>
          <ChatInput
            filePreviews={filePreviews}
            setFilePreviews={setFilePreviews}
            inputRef={inputRef}
            input={input}
            handleKeyDown={handleKeyDown}
            handleInputChange={handleInputChange}
            handlePaste={handlePaste}
            isImprovingPrompt={isImprovingPrompt}
            originalPrompt={originalPrompt}
            handleUndoImprove={handleUndoImprove}
            isStreaming={isStreaming}
            handleImprovePrompt={handleImprovePrompt}
            handleInputSubmit={handleInputSubmit}
          />
        </div>
      ) : (
        <div
          className={`flex-1 overflow-y-auto transition-all duration-200 pb-[50vh] px-2 sm:px-4`}
          ref={messagesRef}
        >
          <div className="w-full px-6 py-8 space-y-6">
            {messages.map((message, index) => {
              if (!message.content.trim() && message.isStreaming) {
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 backdrop-blur-sm rounded-xl border border-border/50">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-loading-dot"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground tracking-wide">
                        Thinking
                      </span>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                  className={`flex ${
                    message.role === Role.user ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex flex-col gap-1 w-fit max-w-[70%] min-w-[60px]  ${
                      message.content.length > 100 && "w-full"
                    }`}
                  >
                    <div
                      className={` transition-all duration-200 rounded-sm
                          bg-muted/20 text-muted-foreground
                      `}
                    >
                      <MessageContent message={message} />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <div className="h-4" ref={messagesEndRef} />
          </div>

          <div
            className={`fixed flex flex-col justify-center p-2 gap-2 bottom-0 right-0  transition-all duration-200 ${
              open ? "left-64" : "left-0"
            }`}
          >
            {showScrollButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{
                  duration: 0.1,
                  ease: "easeIn",
                }}
                onClick={scrollToBottom}
                className="flex max-w-2xl mx-auto bg-background/40 backdrop-blur-md  gap-2 px-2 py-1 items-center right-8 border text-muted-foreground rounded-md shadow-lg hover:shadow-xl transition-all z-50 cursor-pointer hover:shadow-4xl "
                aria-label="Scroll to bottom"
              >
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronDown size={24} />
                </motion.div>
                <span>Scroll To Bottom</span>
              </motion.div>
            )}
            <ChatInput
              filePreviews={filePreviews}
              setFilePreviews={setFilePreviews}
              inputRef={inputRef}
              input={input}
              handleKeyDown={handleKeyDown}
              handleInputChange={handleInputChange}
              handlePaste={handlePaste}
              isImprovingPrompt={isImprovingPrompt}
              originalPrompt={originalPrompt}
              handleUndoImprove={handleUndoImprove}
              isStreaming={isStreaming}
              handleImprovePrompt={handleImprovePrompt}
              handleInputSubmit={handleInputSubmit}
            />
          </div>
        </div>
      )}

      <ReasoningToast reasoning={improvementReason} />
      <Dialog
        isDialogVisible={isSuggestedQuestionDialogOpen}
        setIsDialogVisible={setIsSuggestedQuestionDialogOpen}
      >
        <div className="flex items-center justify-between py-2 px-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            <h2>Consider answering these questions</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSuggestedQuestionDialogOpen(false)}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="w-3 h-3" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="p-3 max-h-[300px] overflow-y-auto">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              Including answers to these questions will help get better
              responses:
            </p>
            <ul className="space-y-2">
              {suggestedQuestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-2 text-xs leading-relaxed"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Chat;

"use client";

import { useToastContext } from "@/components/providers/toast";
import { AvatarMenu } from "@/components/ui/avatar-menu";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import useMessages from "@/hooks/use-message";
import { improvePrompt } from "@/lib/gemini";
import type { ClientMessage } from "@/lib/types";
import { Role } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Loader2,
  Send,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import type { User } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { createChatInDB } from "./[id]/action";
import FilePreviewCard from "./file-preview-card";
import { MessageContent } from "./message-content";
import ReasoningToast from "./prompt-reasoning";
import { SidebarToggle } from "./sidebar-toggle";

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
  const dialogRef = useRef<HTMLDivElement>(null);

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

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
    if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      if (!input.trim()) return;
      const fullMessage = [...filePreviews, input].join("\n\n");
      if (isNewChat) {
        await createChatInDB(chatId, user.id, fullMessage);
      }
      sendMessage(fullMessage);
      setSuggestedQuestions([]);
      setOriginalPrompt(null);
      setInput("");
      setFilePreviews([]);
      scrollToBottom();
      if (isNewChat) {
        window.history.replaceState({}, "", `/chat/${chatId}`);
        setIsNewChat(false);
        setReRenderIO(true);
      }
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setIsSuggestedQuestionDialogOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSuggestedQuestionDialogOpen(false);
      }
    };

    if (isSuggestedQuestionDialogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSuggestedQuestionDialogOpen]);

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

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <header
        className={`flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm sticky top-0 z-20 transition-all duration-200 ${
          open ? "left-64" : "left-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <SidebarToggle />
          {!open && (
            <h1
              className="text-xl font-semibold text-foreground cursor-pointer hover:text-muted-foreground transition-colors"
              onClick={() => setOpen(true)}
            >
              {siteConfig.name}
            </h1>
          )}
        </div>
        <AvatarMenu user={user} />
      </header>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center  max-w-4xl mx-auto w-full">
          {suggestedQuestions.length > 0 && (
            <div className={`flex justify-center mb-4`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 1, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                }}
              >
                <Button
                  variant={"outline"}
                  size={"default"}
                  onClick={() =>
                    setIsSuggestedQuestionDialogOpen(
                      !isSuggestedQuestionDialogOpen
                    )
                  }
                  className="gap-2 "
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>View Suggestions</span>
                </Button>
              </motion.div>
            </div>
          )}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              How can I assist you today?
            </h1>
            <p className="text-lg text-muted-foreground">
              Start a conversation or paste content to get started
            </p>
          </div>

          <div className="w-full max-w-3xl border border-border rounded-2xl shadow-sm hover:shadow-2xl transition-shadow">
            <div className="relative">
              {/* File Previews */}
              {filePreviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-muted/30"
                >
                  <div className="flex gap-3 overflow-x-auto p-2  ">
                    {filePreviews.map((preview, index) => (
                      <FilePreviewCard
                        key={index}
                        preview={preview}
                        index={index}
                        setFilePreviews={setFilePreviews}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <Textarea
                ref={inputRef}
                value={input}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
                onPaste={handlePaste}
                placeholder="Type your message here..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[120px] p-3 text-base placeholder:text-muted-foreground bg-transparent"
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-end px-4 py-2 gap-2 ">
                <div className="flex items-center gap-2">
                  {isImprovingPrompt ? (
                    <Button
                      variant="outline"
                      disabled
                      className="gap-2 text-sm"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enhancing...
                    </Button>
                  ) : originalPrompt ? (
                    <Button
                      variant="outline"
                      onClick={handleUndoImprove}
                      className="gap-2 text-sm hover:bg-secondary"
                    >
                      <Undo2 className="w-4 h-4" />
                      Undo Enhancement
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled={!input.trim()}
                      onClick={handleImprovePrompt}
                      className="gap-2 text-sm hover:bg-secondary disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      Enhance Prompt
                    </Button>
                  )}
                </div>

                <Button
                  disabled={!input.trim() || isStreaming}
                  onClick={handleFormSubmit}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex-1 overflow-y-auto transition-all duration-200 pb-[50vh]`}
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
            className={`fixed  flex flex-col gap-2 bottom-0 left-0 right-0  transition-all duration-200 ${
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
            <div className="max-w-2xl w-full mx-auto mb-3 border border-border rounded-xl shadow-sm hover:shadow-2xl transition-shadow bg-background/60 backdrop-blur-md">
              <AnimatePresence>
                {filePreviews.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-muted/30"
                  >
                    <div className="flex gap-3 overflow-x-auto p-2  ">
                      {filePreviews.map((preview, index) => (
                        <FilePreviewCard
                          key={index}
                          preview={preview}
                          index={index}
                          setFilePreviews={setFilePreviews}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative ">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  placeholder="Type your message here..."
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[100px] px-3 text-base placeholder:text-muted-foreground mt-2"
                />

                {/* Action Buttons */}
                <div className="flex items-center justify-end px-4 py-2 gap-2 ">
                  <div className="flex items-center gap-2">
                    {suggestedQuestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0.8 }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          onClick={() =>
                            setIsSuggestedQuestionDialogOpen(
                              !isSuggestedQuestionDialogOpen
                            )
                          }
                          className="gap-2 "
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>View Suggestions</span>
                        </Button>
                      </motion.div>
                    )}
                    {isImprovingPrompt ? (
                      <Button
                        variant="outline"
                        size={"sm"}
                        disabled
                        className="gap-2 "
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enhancing...
                      </Button>
                    ) : originalPrompt ? (
                      <Button
                        variant="outline"
                        size={"sm"}
                        onClick={handleUndoImprove}
                        className="gap-2 "
                      >
                        <Undo2 className="w-4 h-4" />
                        Undo Enhancement
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size={"sm"}
                        disabled={!input.trim()}
                        onClick={handleImprovePrompt}
                        className="gap-2 disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4" />
                        Enhance Prompt
                      </Button>
                    )}
                  </div>

                  <Button
                    disabled={!input.trim() || isStreaming}
                    onClick={handleFormSubmit}
                    size={"sm"}
                    className="gap-2 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {improvementReason && <ReasoningToast reasoning={improvementReason} />}
      {isSuggestedQuestionDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            ref={dialogRef}
            className={` bg-background/80 backdrop-blur-md border rounded shadow-xl w-full max-w-md `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
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
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Chat;

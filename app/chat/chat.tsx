"use client";

import FadeSlideIn from "@/components/global/fade-slide-in";
import { useToastContext } from "@/components/providers/toast";
import { AvatarMenu } from "@/components/ui/avatar-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import useMessages, { ClientMessage } from "@/hooks/use-message";
import { improvePrompt } from "@/lib/gemini";
import { Markdown } from "@/lib/markdown";
import { Role } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2, Send, Sparkle, Undo2 } from "lucide-react";
import { User } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
  const [filePreviewForModal, setFilePreviewForModal] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState<string | null>(null);
  const [improvementReason, setImprovementReason] = useState<string | null>(
    null
  );
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  const { setToastMessage } = useToastContext();

  const handleImprovePrompt = async () => {
    setIsImprovingPrompt(true);
    setOriginalPrompt(input); // Save original
    const res = await improvePrompt(input);
    setInput(res.improved);
    setImprovementReason(res.reasoning);
    setSuggestedQuestions(res.suggestions);
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
    event.preventDefault(); // prevent it from inserting into input

    if (pasteData.length > 1500) {
      if (filePreviews.includes(pasteData)) {
        setToastMessage("File Already Copied.");
        return;
      }

      setFilePreviews((prev) => [...prev, pasteData]);
    } else {
      if (input.includes(pasteData)) {
        setToastMessage("Text Already Copied.");
        return;
      }
      // If it's not too long, allow paste to input
      setInput((prev) => prev + pasteData);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      if (input.trim()) {
        const fullMessage = [...filePreviews, input].join("\n\n");
        sendMessage(fullMessage);
        setInput("");
        setFilePreviews([]);
        scrollToBottom();
        if (newChat) {
          window.history.replaceState({}, "", `/chat/${chatId}`);
        }
      }
    }
    // if Shift+Enter, do nothing (allow newline)
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const fullMessage = [...filePreviews, input].join("\n\n");
    sendMessage(fullMessage);
    setInput("");
    setFilePreviews([]);
    scrollToBottom();
    // Navigate to /chat/:id
    if (newChat) {
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
        className={`flex items-center justify-between  p-2 sticky  ${
          open ? "left-[16rem]" : "left-0"
        } top-0 right-0 backdrop-blur-sm z-[19]  bg-background  transition-all`}
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
        <div className=" flex-1 flex flex-col  gap-4 items-center justify-center  text-center max-w-3xl mx-auto w-full py-6">
          {improvementReason ? (
            <FadeSlideIn className="w-full mt-16">
              <div className="bg-muted/10 p-3 rounded border text-sm  space-y-2 mx-auto text-left">
                <span className="font-semibold text-muted-foreground mr-2">
                  Reasoning behind Prompt Improvement
                </span>
                <span>{improvementReason}</span>

                {suggestedQuestions.length > 0 && (
                  <div className="text-left">
                    <p className="font-semibold mt-2 text-muted-foreground">
                      Answer these questions in the prompt
                    </p>
                    <ul className="list-disc pl-4">
                      {suggestedQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </FadeSlideIn>
          ) : (
            <h2 className="text-5xl font-bold mb-8">
              What can I help you with ?
            </h2>
          )}

          {/* Input Area */}
          <div className="flex flex-col w-full mx-auto shadow-lg rounded-md  border  relative ">
            {filePreviews.length > 0 && (
              <div className="bg-muted/10 flex gap-2 p-2 overflow-x-auto">
                {filePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="bg-muted/20 px-3 py-2 rounded mb-2 cursor-pointer relative w-[200px] "
                  >
                    <div
                      className="text-left"
                      onClick={() => {
                        setFilePreviewForModal(preview);
                        setShowModal(true);
                      }}
                    >
                      {preview
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .slice(0, 5)
                        .map((line, index) => (
                          <p key={index} className="text-xs truncate">
                            {line}
                          </p>
                        ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="text-sm absolute top-1 right-2 rounded-full h-6 w-6"
                      onClick={() =>
                        setFilePreviews((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Textarea
              ref={inputRef}
              value={input}
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              onPaste={handlePaste}
              placeholder="Type your message..."
              className="flex-1  p-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[100px]  pb-[20px]"
            />

            <div className="flex justify-end items-center gap-2 ">
              {isImprovingPrompt ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Button variant={"outline"} className=" flex gap-2 disabled">
                    <Loader2 className="w-3 h-3 animate-spin" /> Improving
                    Prompt
                  </Button>
                </motion.div>
              ) : originalPrompt ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Button
                    variant={"outline"}
                    onClick={handleUndoImprove}
                    className=" flex gap-2"
                  >
                    <Undo2 className="w-3 h-3" /> Undo
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Button
                    variant={"outline"}
                    disabled={!input.trim()}
                    onClick={handleImprovePrompt}
                    className={` ${
                      !input.trim() ? "opacity-50" : "opacity-100"
                    } flex gap-2`}
                  >
                    <Sparkle className="w-3 h-3" /> Improve Prompt
                  </Button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-2 mr-2"
              >
                <Button
                  size="icon"
                  disabled={!input.trim() || isStreaming}
                  className={`rounded-full  ${
                    !input.trim() ? "opacity-50" : "opacity-100"
                  }`}
                  onClick={handleFormSubmit}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex-1 flex gap-2 flex-col px-2 overflow-y-auto pb-64 pt-16 relative overflow-x-hidden"
          ref={messagesRef}
        >
          {messages.map((message) => {
            if (!message.content.trim() && message.isStreaming) {
              return (
                <div
                  key={message.id}
                  className="self-start bg-muted/20 text-muted-foreground px-4 py-2 rounded text-sm"
                >
                  Thinking<span className="animate-pulse">...</span>
                </div>
              );
            }
            return (
              <div
                key={message.id}
                className={`flex flex-col gap-8 border rounded  max-w-[60%] px-3 py-2  ${
                  message.role === Role.user
                    ? "ml-auto bg-muted/40 text-foreground/70"
                    : "mr-auto bg-muted/20 text-foreground w-full"
                }`}
              >
                {message.role === Role.user ? (
                  message.content
                ) : (
                  <Typography>
                    <Markdown>{message.content}</Markdown>
                  </Typography>
                )}
              </div>
            );
          })}
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
            }  `}
          >
            <div className="border border-p max-w-3xl mx-auto rounded-t-md backdrop-blur-md pt-2 px-2">
              <div className="border w-full rounded-t-md bg-background ">
                {filePreviews.length > 0 && (
                  <div className="bg-muted/10 flex gap-2 p-2 overflow-x-auto">
                    {filePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="bg-muted/20 px-3 py-2 rounded mb-2 cursor-pointer relative w-[200px] "
                      >
                        <div
                          className="text-left"
                          onClick={() => {
                            setFilePreviewForModal(preview);
                            setShowModal(true);
                          }}
                        >
                          {preview
                            .split("\n")
                            .filter((line) => line.trim() !== "")
                            .slice(0, 5)
                            .map((line, index) => (
                              <p key={index} className="text-xs truncate">
                                {line}
                              </p>
                            ))}
                        </div>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-sm absolute top-1 right-2 rounded-full h-6 w-6"
                          onClick={() =>
                            setFilePreviews((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Textarea
                  ref={inputRef}
                  value={input}
                  onKeyDown={handleKeyDown}
                  onChange={handleInputChange}
                  onPaste={handlePaste}
                  placeholder="Type your message..."
                  className="flex-1  p-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[100px]  pb-[20px]"
                />

                <div className="flex justify-end items-center gap-2 ">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="p-2 mr-2"
                  >
                    <Button
                      size="icon"
                      disabled={!input.trim() || isStreaming}
                      className={`rounded-full  ${
                        !input.trim() ? "opacity-50" : "opacity-100"
                      }`}
                      onClick={handleFormSubmit}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl border p-0">
          <div className="max-h-[80vh] overflow-auto text-sm whitespace-pre-wrap px-3 py-2">
            {filePreviewForModal}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;

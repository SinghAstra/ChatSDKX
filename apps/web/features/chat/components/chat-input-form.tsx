"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2, Sparkles, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSimulatedEnhancePrompt } from "../hooks/use-simulated-enhance-prompt";
import { ContextualActionBar } from "./contextual-action-bar";
import { siteConfig } from "@/config/site";

interface ChatInputFormProps {
  chatId?: string;
  initialValue?: string;
  onSubmit: (message: string) => void;
  isStreaming?: boolean;
  onStop?: () => void;
}

export function ChatInputForm({
  chatId,
  initialValue = "",
  onSubmit,
  isStreaming,
  onStop,
}: ChatInputFormProps) {
  const [inputValue, setInputValue] = useState(initialValue);

  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);

  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);

    setInputValue(initialValue);
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const enhancer = useSimulatedEnhancePrompt();

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [inputValue]);

  useEffect(() => {
    if (initialValue && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [initialValue]);

  const handleUndo = () => {
    setInputValue(enhancer.originalPrompt);

    enhancer.undo();
  };

  const handleDismiss = () => {
    enhancer.reset();
  };

  const handleEnhance = async () => {
    if (!inputValue.trim() || isStreaming) return;

    const response = await enhancer.enhance(inputValue, chatId);

    if (response.status === "improved" && response.enhancedPrompt) {
      setInputValue(response.enhancedPrompt);
    }
  };

  const handleSubmit = () => {
    if (isStreaming) {
      onStop?.();

      return;
    }

    if (!inputValue.trim() || enhancer.status === "loading") return;

    onSubmit(inputValue);

    setInputValue("");

    enhancer.reset();

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!isStreaming) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <ContextualActionBar
          result={enhancer}
          onUndo={handleUndo}
          onDismiss={handleDismiss}
        />

        <div className="relative flex flex-col w-full rounded border border-foreground/10 bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={enhancer.status === "loading" || isStreaming}
            rows={1}
            className="w-full max-h-50 min-h-14 resize-none bg-transparent px-4 py-4 text-[15px] outline-none placeholder:text-foreground/40 disabled:opacity-50 scrollbar-thin scrollbar-thumb-foreground/10"
          />

          <div className="flex items-center justify-between p-2 pt-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleEnhance}
              disabled={
                !inputValue.trim() ||
                enhancer.status === "loading" ||
                isStreaming
              }
              className="h-8 gap-1.5 rounded text-foreground/60 hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-40"
            >
              {enhancer.status === "loading" ? (
                <Loader2 className="size-3.5 animate-spin text-primary" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              <span className="text-xs font-medium">Enhance</span>
            </Button>

            <Button
              type="button"
              size="icon"
              onClick={isStreaming ? onStop : handleSubmit}
              disabled={
                (!inputValue.trim() && !isStreaming) ||
                enhancer.status === "loading"
              }
              className="size-8 rounded border bg-muted/70 hover:bg-muted/90 disabled:opacity-30 disabled:hover:bg-muted/90 transition-all"
            >
              {isStreaming ? (
                <Square className="size-3.5 fill-foreground" />
              ) : (
                <ArrowUp className="size-4 text-foreground" />
              )}
            </Button>
          </div>
        </div>

        <div className="text-center mt-3">
          <p className="text-xs text-foreground/40">
            {siteConfig.name} can make mistakes. Consider verifying important
            information.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSimulatedEnhancePrompt } from "../hooks/use-simulated-enhance-prompt";
import { ContextualActionBar } from "./contextual-action-bar";
import { siteConfig } from "@/config/site";

export function ChatInputForm() {
  const [inputValue, setInputValue] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const enhancer = useSimulatedEnhancePrompt();

  // Auto-resize the textarea dynamically based on content
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [inputValue]);

  const handleUndo = () => {
    setInputValue(enhancer.originalPrompt);

    enhancer.undo();
  };

  const handleDismiss = () => {
    enhancer.reset();
  };

  const handleEnhance = async () => {
    if (!inputValue.trim()) return;

    const response = await enhancer.enhance(inputValue);

    if (response.status === "improved" && response.enhancedPrompt) {
      setInputValue(response.enhancedPrompt);
    }
  };

  const handleSubmit = () => {
    if (!inputValue.trim() || enhancer.status === "loading") return;

    console.log("Submitting message:", inputValue);

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

      handleSubmit();
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
            disabled={enhancer.status === "loading"}
            rows={1}
            className="w-full max-h-50 min-h-14 resize-none bg-transparent px-4 py-4 text-[15px] outline-none placeholder:text-foreground/40 disabled:opacity-50 scrollbar-thin scrollbar-thumb-foreground/10"
          />

          <div className="flex items-center justify-between p-2 pt-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleEnhance}
              disabled={!inputValue.trim() || enhancer.status === "loading"}
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
              onClick={handleSubmit}
              disabled={!inputValue.trim() || enhancer.status === "loading"}
              className="size-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30 disabled:hover:bg-foreground transition-all"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-3">
          <p className="text-xs text-foreground/40">
            ${siteConfig.name} can make mistakes. Consider verifying important
            information.
          </p>
        </div>
      </div>
    </div>
  );
}

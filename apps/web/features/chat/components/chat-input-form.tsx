"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";

export function ChatInputForm() {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    console.log("Sending:", input);

    // TODO: Create chat mutation and route to /chat/:id
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-end w-full max-w-3xl mx-auto bg-muted/40 border rounded-2xl focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 overflow-hidden transition-all"
    >
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message..."
        className="min-h-15 max-h-50 w-full resize-none border-0 bg-transparent py-4 pl-4 pr-12 focus-visible:ring-0 shadow-none text-base sm:text-sm"
        rows={1}
      />

      <div className="absolute right-2 bottom-2">
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="size-8 rounded-xl transition-opacity disabled:opacity-30"
        >
          <SendHorizonal className="size-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}

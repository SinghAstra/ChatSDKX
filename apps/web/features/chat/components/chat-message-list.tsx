import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { AiMessage } from "./ai-message";
import { UserMessage } from "./user-message";

export interface MessageItem {
  id?: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

interface ChatMessageListProps {
  messages: MessageItem[];
  onEditMessage?: (content: string) => void;
  onRetryMessage?: () => void;
}

export function ChatMessageList({
  messages,
  onEditMessage,
  onRetryMessage,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col space-y-6 pb-4 w-full relative">
      {messages.map((msg, index) =>
        msg.role === "user" ? (
          <UserMessage
            key={index}
            content={msg.content}
            onEdit={onEditMessage}
          />
        ) : (
          <AiMessage
            key={index}
            content={msg.content}
            isError={msg.isError}
            onRetry={onRetryMessage}
          />
        )
      )}

      <div ref={bottomRef} className="h-px w-full shrink-0" />

      {showScrollButton && (
        <div className="sticky bottom-4 w-full flex justify-center pointer-events-none z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={scrollToBottom}
            className="pointer-events-auto scroll-auto flex items-center justify-center size-8 rounded-full bg-muted/50 border shadow-sm hover:bg-muted text-foreground transition-all"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { AiMessage } from "./ai-message";
import { UserMessage } from "./user-message";

interface Message {
  role: string;
  content: string;
}

interface ChatMessageListProps {
  messages: Message[];
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
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
      {messages.map((m, i) => {
        if (m.role === "user") {
          return <UserMessage key={i} content={m.content} />;
        }

        return <AiMessage key={i} content={m.content} />;
      })}

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

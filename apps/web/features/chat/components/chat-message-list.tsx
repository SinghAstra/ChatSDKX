import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

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
    // Watch the bottom anchor element to see if it is visible on screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the bottom is NOT intersecting (user scrolled up), show the button
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
  }, []); // Run once on mount

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col space-y-6 pb-4 w-full relative">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`flex w-full ${
            m.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`text-[15px] leading-relaxed ${
              m.role === "user"
                ? "bg-muted/30 text-muted-foreground px-5 py-3.5 rounded-3xl max-w-[85%] md:max-w-[75%]"
                : "bg-transparent text-foreground w-full py-2"
            }`}
          >
            {m.content}
          </div>
        </div>
      ))}

      <div ref={bottomRef} className="h-px w-full shrink-0" />

      {showScrollButton && (
        <div className="sticky bottom-4 w-full flex justify-center pointer-events-none z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={scrollToBottom}
            className="pointer-events-auto scroll-auto flex items-center justify-center size-8 rounded-full bg-muted/50 border  shadow-sm hover:bg-muted text-foreground transition-all"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

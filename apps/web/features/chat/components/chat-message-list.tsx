import { useEffect, useRef } from "react";

interface Message {
  role: string;
  content: string;
}

interface ChatMessageListProps {
  messages: Message[];
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 pb-4 w-full">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`p-4 rounded-2xl text-[15px] max-w-[85%] ${
            m.role === "user"
              ? "bg-foreground text-background self-end rounded-br-sm"
              : "bg-muted/50 border border-border/50 text-foreground self-start rounded-bl-sm"
          }`}
        >
          {m.content}
        </div>
      ))}

      <div ref={bottomRef} className="h-px w-full shrink-0" />
    </div>
  );
}

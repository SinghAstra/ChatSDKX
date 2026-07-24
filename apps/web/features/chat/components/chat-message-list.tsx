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
    <div className="flex flex-col space-y-6 pb-4 w-full">
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
                ? "bg-muted/30 text-foreground px-5 py-3.5 rounded max-w-[85%] md:max-w-[75%]"
                : "bg-transparent text-foreground w-full py-2"
            }`}
          >
            {m.content}
          </div>
        </div>
      ))}

      <div ref={bottomRef} className="h-px w-full shrink-0" />
    </div>
  );
}

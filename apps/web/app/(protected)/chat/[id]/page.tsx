import { ChatView } from "@/features/chat/components/chat-view";
import { use } from "react";

interface ChatThreadPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatThreadPage({ params }: ChatThreadPageProps) {
  const resolvedParams = use(params);

  const chatId = resolvedParams.id;

  const initialMessages = [
    {
      role: "user" as const,
      content: `Hello! Can you help me with thread ID: ${chatId}?`,
    },
    {
      role: "assistant" as const,
      content: `Welcome back to thread **${chatId}**. How can I help you today?`,
    },
  ];

  return <ChatView chatId={chatId} initialMessages={initialMessages} />;
}

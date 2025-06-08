import { ClientMessage } from "@/lib/types";
import { useEffect, useState } from "react";

export default function useMessages(
  initialMessages: ClientMessage[],
  chatId: string
) {
  const [messages, setMessages] = useState<ClientMessage[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    setMessages(initialMessages);
  }, [chatId, initialMessages]);

  const sendMessage = async (input: string) => {
    setIsStreaming(true);
    const userMessage: ClientMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };
    const modelMessage: ClientMessage = {
      id: "streaming",
      role: "model",
      content: "",
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, modelMessage]);

    const res = await fetch(`/api/chat/${chatId}/ask`, {
      method: "POST",
      body: JSON.stringify({
        message: input,
        messages:
          messages.length > 7 ? messages.slice(-8, -2) : messages.slice(0, -2),
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === "streaming"
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      );
    }

    // Remove the isStreaming flag so UI can render it as a full response
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === "streaming"
          ? { ...msg, id: crypto.randomUUID(), isStreaming: false }
          : msg
      )
    );

    setIsStreaming(false);
  };

  return { messages, sendMessage, isStreaming };
}

import { ClientMessage } from "@/lib/types";
import { useState } from "react";

export default function useMessages(
  initialMessages: ClientMessage[],
  chatId: string
) {
  const [messages, setMessages] = useState<ClientMessage[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (input: string) => {
    setIsStreaming(true);
    const streamingMessageId = crypto.randomUUID();
    const userMessage: ClientMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };
    const modelMessage: ClientMessage = {
      id: streamingMessageId,
      role: "model",
      content: "",
      isStreaming: true,
    };

    const prevMessages = [...messages];

    setMessages((prev) => [...prev, userMessage, modelMessage]);

    const res = await fetch(`/api/chat/${chatId}/ask`, {
      method: "POST",
      body: JSON.stringify({
        message: input,
        messages:
          prevMessages.length > 6 ? prevMessages.slice(-6) : prevMessages,
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
          msg.id === streamingMessageId
            ? { ...msg, content: msg.content + chunk }
            : msg
        )
      );
    }

    // Remove the isStreaming flag so UI can render it as a full response
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === streamingMessageId ? { ...msg, isStreaming: false } : msg
      )
    );

    setIsStreaming(false);
  };

  return { messages, sendMessage, isStreaming };
}

"use client";

import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInputForm } from "@/features/chat/components/chat-input-form";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { ChatThreadSkeleton } from "@/features/chat/components/chat-thread-skeleton";
import { useChatThread } from "@/features/chat/hooks/use-chat-thread";
import { chatKeys } from "@/features/chat/api/query-keys";
import { CHAT_ROLE, type ChatThread } from "@repo/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ChatViewProps {
  chatId?: string;
}

export function ChatView({ chatId: initialChatId }: ChatViewProps) {
  const queryClient = useQueryClient();

  const [chatId] = useState<string>(
    () => initialChatId || `chat_${Math.random().toString(36).substring(2, 9)}`
  );

  const [editingPrompt, setEditingPrompt] = useState<string>("");

  const { thread, isLoading, sendMessage, isStreaming } = useChatThread(chatId);

  const handleSendMessage = async (prompt: string) => {
    setEditingPrompt("");

    // If it's a new chat, update the browser URL without a full page reload
    if (!initialChatId && window.location.pathname === "/chat") {
      window.history.pushState(null, "", `/chat/${chatId}`);
    }

    await sendMessage({
      prompt,
      onChunk: (accumulatedText) => {
        // Live-update the TanStack Query cache token-by-token as chunks arrive from the server stream
        queryClient.setQueryData<ChatThread>(chatKeys.detail(chatId), (old) => {
          if (!old) return old;

          const messages = [...old.messages];

          const lastMsg = messages[messages.length - 1];

          if (lastMsg && lastMsg.role === CHAT_ROLE.ASSISTANT) {
            messages[messages.length - 1] = {
              ...lastMsg,
              content: accumulatedText,
            };
          }

          return { ...old, messages };
        });
      },
    });
  };

  const handleEditMessage = (content: string) => {
    setEditingPrompt(content);
  };

  const handleRetryMessage = () => {
    if (!thread || thread.messages.length < 2) return;

    const lastUserMessage = thread.messages[thread.messages.length - 2];

    if (lastUserMessage && lastUserMessage.role === CHAT_ROLE.USER) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const messages = thread?.messages ?? [];

  const isHistoryLoading =
    isLoading && !!initialChatId && messages.length === 0;

  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        <div
          className={`flex flex-col w-full max-w-4xl mx-auto p-4 flex-1 ${
            isHistoryLoading || messages.length === 0
              ? "justify-center"
              : "justify-start"
          }`}
        >
          {isHistoryLoading ? (
            <ChatThreadSkeleton />
          ) : messages.length === 0 ? (
            <ChatEmptyState onSelectPrompt={handleSendMessage} />
          ) : (
            <ChatMessageList
              messages={messages}
              onEditMessage={handleEditMessage}
              onRetryMessage={handleRetryMessage}
            />
          )}
        </div>
      </div>

      <div className="w-full shrink-0 p-1">
        <div className="w-full max-w-4xl mx-auto">
          <ChatInputForm
            chatId={chatId}
            initialValue={editingPrompt}
            onSubmit={handleSendMessage}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}

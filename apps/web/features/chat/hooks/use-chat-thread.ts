"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "../api/query-keys";
import { getChatThreadAction } from "../actions/get-chat-thread";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { CHAT_ROLE, ChatThread } from "@repo/shared";

export function useChatThread(chatId: string) {
  const queryClient = useQueryClient();

  const queryKey = chatKeys.detail(chatId);

  const threadQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await getChatThreadAction(chatId);

      if (!res.success) throw new Error(res.error.message);

      return res.data;
    },
    enabled: !!chatId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      prompt,
      onChunk,
    }: {
      prompt: string;
      onChunk: (chunk: string) => void;
    }) => {
      // Retrieve session token on the client for Express auth middleware
      const session = await getSession();

      const token = session?.accessToken;

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
        "http://localhost:4000";

      const response = await fetch(`${baseUrl}/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: prompt }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to establish stream connection.");
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        accumulatedText += chunk;

        onChunk(accumulatedText);
      }

      return accumulatedText;
    },
    onMutate: async ({ prompt }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<ChatThread>(queryKey);

      // Optimistic update: Inject user prompt & empty assistant placeholder for "Thinking" state
      queryClient.setQueryData<ChatThread>(queryKey, (old) => {
        if (!old) {
          return {
            id: chatId,
            title: null,
            messages: [
              {
                id: `temp-user-${Date.now()}`,
                role: CHAT_ROLE.USER,
                content: prompt,
              },
              {
                id: `temp-asst-${Date.now()}`,
                role: CHAT_ROLE.ASSISTANT,
                content: "",
              },
            ],
          };
        }

        return {
          ...old,
          messages: [
            ...old.messages,
            {
              id: `temp-user-${Date.now()}`,
              role: CHAT_ROLE.USER,
              content: prompt,
            },
            {
              id: `temp-asst-${Date.now()}`,
              role: CHAT_ROLE.ASSISTANT,
              content: "",
            },
          ],
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      toast.error(err.message || "Failed to stream response.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });

      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });

  return {
    thread: threadQuery.data,
    isLoading: threadQuery.isLoading,
    isFetching: threadQuery.isFetching,
    sendMessage: sendMessageMutation.mutateAsync,
    isStreaming: sendMessageMutation.isPending,
  };
}

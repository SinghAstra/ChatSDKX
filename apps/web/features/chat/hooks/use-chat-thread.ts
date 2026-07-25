"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "../api/query-keys";
import { getChatThreadAction } from "../actions/get-chat-thread";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import { CHAT_ROLE, ChatThread, ChatBase } from "@repo/shared";

export function useChatThread(chatId: string) {
  const queryClient = useQueryClient();

  const queryKey = chatKeys.detail(chatId);

  const listsQueryKey = chatKeys.lists();

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
      const session = await getSession();

      const token = session?.accessToken;

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
        "http://localhost:5000";

      const response = await fetch(`${baseUrl}/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Server error (${response.status}): ${errorText || response.statusText}`
        );
      }

      if (!response.body) {
        throw new Error(
          "Failed to establish stream connection: Response body missing."
        );
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

      await queryClient.cancelQueries({ queryKey: listsQueryKey });

      const previousThreadData = queryClient.getQueryData<ChatThread>(queryKey);

      const previousListsData =
        queryClient.getQueryData<ChatBase[]>(listsQueryKey);

      // Optimistically update the individual chat thread view
      queryClient.setQueryData<ChatThread>(queryKey, (old) => {
        const newUserMsg = {
          id: `temp-user-${Date.now()}`,
          role: CHAT_ROLE.USER,
          content: prompt,
        };

        const newAsstMsg = {
          id: `temp-asst-${Date.now()}`,
          role: CHAT_ROLE.ASSISTANT,
          content: "",
        };

        if (!old) {
          return {
            id: chatId,
            title: null,
            messages: [newUserMsg, newAsstMsg],
          };
        }

        return { ...old, messages: [...old.messages, newUserMsg, newAsstMsg] };
      });

      // Optimistically prepend the new placeholder chat into the sidebar list cache
      queryClient.setQueryData<ChatBase[]>(listsQueryKey, (oldLists = []) => {
        // Check if this chat is already in the list to avoid duplicates
        const exists = oldLists.some((chat) => chat.id === chatId);

        if (exists) return oldLists;

        const newOptimisticChat: ChatBase = {
          id: chatId,
          title: null,
          createdAt: String(new Date()),
          updatedAt: String(new Date()),
        };

        return [newOptimisticChat, ...oldLists];
      });

      return { previousThreadData, previousListsData };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any, variables, context) => {
      if (context?.previousThreadData) {
        queryClient.setQueryData(queryKey, context.previousThreadData);
      }

      if (context?.previousListsData) {
        queryClient.setQueryData(listsQueryKey, context.previousListsData);
      }

      toast.error(err.message || "Failed to stream response.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });

      queryClient.invalidateQueries({ queryKey: listsQueryKey });
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

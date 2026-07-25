"use client";

import { updateChatTitleAction } from "@/features/chat/actions/update-chat-title";
import { chatKeys } from "@/features/chat/api/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Use the exact type that your sidebar query returns
interface SidebarChat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function useUpdateChatTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      title,
    }: {
      chatId: string;
      title: string;
    }) => {
      const res = await updateChatTitleAction(chatId, title);

      if (!res.success) throw new Error(res.error.message);

      return { chatId, title };
    },
    onMutate: async ({ chatId, title }) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.lists() });

      const previousChats = queryClient.getQueryData<SidebarChat[]>(
        chatKeys.lists()
      );

      queryClient.setQueryData<SidebarChat[]>(chatKeys.lists(), (old) => {
        if (!old) return old;

        return old.map((chat) =>
          chat.id === chatId ? { ...chat, title } : chat
        );
      });

      queryClient.setQueryData(chatKeys.detail(chatId), (old) => {
        if (!old) return old;

        return { ...old, title };
      });

      return { previousChats };
    },
    onError: (err, variables, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(chatKeys.lists(), context.previousChats);
      }

      toast.error(err.message || "Failed to update chat title.");
    },
    onSettled: (data, error, variables) => {
      // refetch in background to ensure data sync
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

      queryClient.invalidateQueries({
        queryKey: chatKeys.detail(variables.chatId),
      });
    },
  });
}

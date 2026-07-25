"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChatAction } from "../actions/delete-chat";
import { chatKeys } from "../api/query-keys";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { ChatBase } from "@repo/shared";
import { ROUTES } from "@/lib/routes";

export function useDeleteChat() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const pathname = usePathname();

  return useMutation({
    mutationFn: async (chatId: string) => {
      const res = await deleteChatAction(chatId);

      if (!res.success) throw new Error(res.error.message);

      return chatId;
    },
    onMutate: async (deletedChatId) => {
      // 1. Cancel ongoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: chatKeys.lists() });

      // 2. Snapshot the previous value
      const previousChats = queryClient.getQueryData<ChatBase[]>(
        chatKeys.lists()
      );

      // 3. Optimistically remove the chat from the sidebar list
      queryClient.setQueryData<ChatBase[]>(chatKeys.lists(), (old) => {
        if (!old) return old;

        return old.filter((chat) => chat.id !== deletedChatId);
      });

      // 4. Smart Routing: If the user is viewing the chat they just deleted, kick them out
      if (pathname === `/chat/${deletedChatId}`) {
        router.push(ROUTES.CHAT); // Navigates to /chat
      }

      return { previousChats };
    },
    onError: (err, deletedChatId, context) => {
      // Rollback to the snapshot on failure
      if (context?.previousChats) {
        queryClient.setQueryData(chatKeys.lists(), context.previousChats);
      }

      toast.error(err.message || "Failed to delete chat.");
    },
    onSettled: (deletedChatId) => {
      // Re-sync with the server
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

      if (deletedChatId) {
        // Clear the deleted chat's cache to free up memory
        queryClient.removeQueries({ queryKey: chatKeys.detail(deletedChatId) });
      }
    },
  });
}

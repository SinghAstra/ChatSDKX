"use client";

import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "../api/query-keys";
import { getChatsAction } from "../actions/get-chats";

export function useChatList() {
  const query = useQuery({
    queryKey: chatKeys.lists(),
    queryFn: async () => {
      const res = await getChatsAction();

      if (!res.success) throw new Error(res.error.message);

      return res.data;
    },
  });

  return {
    chats: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "../api/query-keys";
import { getPromptSuggestionsAction } from "../actions/get-prompt-suggestions";

export function usePromptSuggestions() {
  const query = useQuery({
    queryKey: chatKeys.suggestions(),
    queryFn: async () => {
      const res = await getPromptSuggestionsAction();

      if (!res.success) {
        throw new Error(res.error.message);
      }

      return res.data;
    },
  });

  return {
    suggestions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

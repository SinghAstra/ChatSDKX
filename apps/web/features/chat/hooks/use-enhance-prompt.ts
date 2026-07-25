"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { enhancePromptAction } from "../actions/enhance-prompt";
import { toast } from "sonner";
import { logError } from "@repo/shared";

export type EnhancerStatus =
  "idle" | "loading" | "improved" | "needs_info" | "error";

export interface EnhancementResult {
  status: EnhancerStatus;
  originalPrompt: string;
  enhancedPrompt?: string;
  rationale?: string;
  questions?: string[];
}

const initialState: EnhancementResult = {
  status: "idle",
  originalPrompt: "",
};

export function useEnhancePrompt() {
  const [result, setResult] = useState<EnhancementResult>(initialState);

  const enhanceMutation = useMutation({
    mutationFn: async ({
      prompt,
      chatId,
    }: {
      prompt: string;
      chatId?: string;
    }) => {
      const res = await enhancePromptAction(prompt, chatId);

      if (!res.success) throw new Error(res.error.message);

      return res.data;
    },
    onMutate: (variables) => {
      setResult({ status: "loading", originalPrompt: variables.prompt });
    },
    onSuccess: (data, variables) => {
      setResult({
        status: data.status,
        originalPrompt: variables.prompt,
        enhancedPrompt: data.enhancedPrompt,
        rationale: data.rationale,
        questions: data.questions,
      });
    },
    onError: (err, variables) => {
      setResult({ status: "error", originalPrompt: variables.prompt });

      toast.error(err.message || "Failed to enhance prompt.");
    },
  });

  const enhance = async (prompt: string, chatId?: string) => {
    try {
      return await enhanceMutation.mutateAsync({ prompt, chatId });
    } catch (error) {
      logError(error);

      return { status: "error" as const };
    }
  };

  const undo = () => setResult((prev) => ({ ...prev, status: "idle" }));

  const reset = () => setResult(initialState);

  return {
    enhance,
    status: result.status,
    result,
    undo,
    reset,
    originalPrompt: result.originalPrompt,
  };
}

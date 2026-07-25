"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { enhancePromptAction } from "../actions/enhance-prompt";
import { toast } from "sonner";
import { logError } from "@repo/shared";

type EnhancerStatus = "idle" | "loading" | "improved" | "error";

export function useEnhancePrompt() {
  const [originalPrompt, setOriginalPrompt] = useState("");

  const [status, setStatus] = useState<EnhancerStatus>("idle");

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
    onMutate: () => setStatus("loading"),
    onSuccess: () => setStatus("improved"),
    onError: (err) => {
      setStatus("error");

      toast.error(err.message || "Failed to enhance prompt.");
    },
  });

  const enhance = async (prompt: string, chatId?: string) => {
    setOriginalPrompt(prompt);

    try {
      const data = await enhanceMutation.mutateAsync({ prompt, chatId });

      return {
        status: "improved" as const,
        enhancedPrompt: data.enhancedPrompt,
      };
    } catch (error) {
      logError(error);

      return { status: "error" as const };
    }
  };

  const undo = () => {
    setStatus("idle");
  };

  const reset = () => {
    setStatus("idle");

    setOriginalPrompt("");
  };

  return {
    enhance,
    status,
    undo,
    reset,
    originalPrompt,
  };
}

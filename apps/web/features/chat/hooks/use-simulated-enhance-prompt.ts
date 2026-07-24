import { useState } from "react";

export type EnhancementStatus = "idle" | "loading" | "improved" | "needs_info";

export interface EnhancementResult {
  status: EnhancementStatus;
  originalPrompt: string;
  enhancedPrompt?: string;
  rationale?: string;
  questions?: string[];
}

export function useSimulatedEnhancePrompt() {
  const [result, setResult] = useState<EnhancementResult>({
    status: "idle",
    originalPrompt: "",
  });

  const enhance = (prompt: string) => {
    if (!prompt.trim()) return;

    setResult({ status: "loading", originalPrompt: prompt });

    // Simulate network delay
    setTimeout(() => {
      if (prompt.split(" ").length < 4) {
        setResult({
          status: "needs_info",
          originalPrompt: prompt,
          questions: [
            "What specific framework or language are you using?",
            "Can you provide a brief example of what you are trying to achieve?",
          ],
        });
      } else {
        setResult({
          status: "improved",
          originalPrompt: prompt,
          enhancedPrompt: `Can you act as a senior software engineer and help me with: ${prompt}. Please include code snippets and best practices.`,
          rationale:
            "Added persona constraint and requested specific outputs (code snippets and best practices) to get a more structured answer.",
        });
      }
    }, 1500);
  };

  const undo = () => {
    setResult({ status: "idle", originalPrompt: "" });
  };

  const reset = () => {
    setResult({ status: "idle", originalPrompt: "" });
  };

  return {
    ...result,
    enhance,
    undo,
    reset,
  };
}

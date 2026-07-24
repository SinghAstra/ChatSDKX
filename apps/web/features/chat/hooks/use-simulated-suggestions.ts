import { Code, MessageSquare, Sparkles, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

export const SUGGESTIONS = [
  {
    icon: Code,
    title: "Review this code",
    prompt: "Can you help me optimize this React component?",
  },
  {
    icon: Terminal,
    title: "Debug an error",
    prompt: "I'm getting a hydration mismatch error in Next.js.",
  },
  {
    icon: Sparkles,
    title: "Brainstorm ideas",
    prompt: "What are some good database schemas for a chat app?",
  },
  {
    icon: MessageSquare,
    title: "Explain a concept",
    prompt: "Explain how JavaScript closures work under the hood.",
  },
];

export function useSimulatedSuggestions() {
  const [data, setData] = useState<typeof SUGGESTIONS | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(SUGGESTIONS);

      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}

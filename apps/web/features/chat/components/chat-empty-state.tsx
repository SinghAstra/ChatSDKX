"use client";

import { Card } from "@/components/ui/card";
import { Code, MessageSquare, Sparkles, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

// Simulated Backend Data
const SUGGESTIONS = [
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

// Simulated TanStack Query Hook
function useSimulatedSuggestions() {
  const [data, setData] = useState<typeof SUGGESTIONS | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(SUGGESTIONS);

      setIsLoading(false);
    }, 1500); // 1.5s simulated delay

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}

export function ChatEmptyStateSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3 w-full flex flex-col items-center">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
        <div className="h-5 w-80 bg-muted animate-pulse rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4 flex flex-col gap-3 border-border/50">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-md bg-muted animate-pulse" />
              <div className="h-4 w-28 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-3 w-4/5 bg-muted animate-pulse rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ChatEmptyState() {
  const { data, isLoading } = useSimulatedSuggestions();

  if (isLoading) {
    return <ChatEmptyStateSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground">
          Select a prompt below or type your own to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {data?.map((suggestion, index) => {
          const Icon = suggestion.icon;

          return (
            <Card
              key={index}
              className="p-4 flex flex-col gap-2 cursor-pointer hover:bg-muted/50 transition-colors border-border/50 group"
              // onClick={() => handleSuggestionClick(suggestion.prompt)}
            >
              <div className="flex items-center gap-2 text-foreground font-medium">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="size-4" />
                </div>
                <span className="text-sm">{suggestion.title}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {suggestion.prompt}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

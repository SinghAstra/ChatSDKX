"use client";

import { Card } from "@/components/ui/card";
import { ChatEmptyStateSkeleton } from "./chat-empty-state-skeleton";
import { useSimulatedSuggestions } from "../hooks/use-simulated-suggestions";

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
              className="p-4 rounded flex flex-col gap-2 cursor-pointer bg-muted/70 hover:bg-muted/30 transition-colors border-border/50 group"
              // onClick={() => handleSuggestionClick(suggestion.prompt)}
            >
              <div className="flex items-center gap-2 text-foreground font-medium">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-muted/50 transition-colors">
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

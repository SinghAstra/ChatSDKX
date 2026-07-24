import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle, RotateCcw, X } from "lucide-react";
import { EnhancementResult } from "../hooks/use-simulated-enhance-prompt";

interface ContextualActionBarProps {
  result: EnhancementResult;
  onUndo: () => void;
  onDismiss: () => void;
}

export function ContextualActionBar({
  result,
  onUndo,
  onDismiss,
}: ContextualActionBarProps) {
  if (result.status === "idle" || result.status === "loading") {
    return null;
  }

  if (result.status === "improved") {
    return (
      <div className="flex items-start justify-between w-full p-3 mb-2 rounded-lg border border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex gap-3 items-start">
          <div className="p-1.5 rounded-md bg-primary/20 text-primary shrink-0 mt-0.5">
            <Sparkles className="size-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Prompt enhanced for clarity
            </p>
            <p className="text-xs text-foreground/70 leading-relaxed">
              {result.rationale}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            className="h-8 px-2 text-foreground/70 hover:text-foreground hover:bg-foreground/5"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Undo
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="size-8 text-foreground/50 hover:text-foreground hover:bg-foreground/5"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (result.status === "needs_info") {
    return (
      <div className="flex items-start justify-between w-full p-3 mb-2 rounded-lg border border-destructive/20 bg-destructive/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex gap-3 items-start">
          <div className="p-1.5 rounded-md bg-destructive/20 text-destructive shrink-0 mt-0.5">
            <AlertCircle className="size-4" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              To get a better answer, consider adding:
            </p>
            <ul className="text-xs text-foreground/70 space-y-1 list-disc list-inside">
              {result.questions?.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="size-8 shrink-0 ml-4 text-foreground/50 hover:text-foreground hover:bg-foreground/5"
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return null;
}

import { Card } from "@/components/ui/card";

export function ChatEmptyStateSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3 w-full flex flex-col items-center">
        <div className="h-8 w-64 bg-muted/80 animate-pulse rounded-md" />
        <div className="h-5 w-80 bg-muted/80 animate-pulse rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {[1, 2, 3, 4].map((i) => (
          <Card
            key={i}
            className="p-4 flex flex-col gap-3 bg-muted/30 border-border/50"
          >
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-md bg-muted/70 animate-pulse" />
              <div className="h-4 w-28 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted/70 animate-pulse rounded-md" />
              <div className="h-3 w-4/5 bg-muted/70 animate-pulse rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ChatThreadSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 w-full max-w-4xl mx-auto animate-pulse flex-1 justify-end">
      <div className="flex justify-end">
        <div className="h-12 w-2/3 bg-muted rounded" />
      </div>
      <div className="flex justify-start">
        <div className="h-24 w-4/5 bg-muted rounded" />
      </div>
      <div className="flex justify-end">
        <div className="h-16 w-1/2 bg-muted rounded" />
      </div>
    </div>
  );
}

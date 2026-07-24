"use client";

import { ErrorFallback } from "@/components/reusable/error-fallback";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChatError({ error, reset }: ErrorProps) {
  return (
    <ErrorFallback
      pageName="Chat"
      error={error}
      reset={reset}
      fallbackHref="/chat"
    />
  );
}

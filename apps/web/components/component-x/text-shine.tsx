import React from "react";

interface TextShineProps {
  children: React.ReactNode;
}

export function TextShine({ children }: TextShineProps) {
  return (
    <span className="inline-flex bg-[linear-gradient(110deg,var(--muted),45%,var(--foreground),55%,var(--muted-foreground))] bg-size-[200%_100%] animate-shine bg-clip-text text-transparent">
      {children}
    </span>
  );
}

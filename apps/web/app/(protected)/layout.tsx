import React from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {children}
    </div>
  );
}

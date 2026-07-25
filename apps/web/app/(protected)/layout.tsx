import React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/features/chat/components/chat-sidebar";
import { ChatHeader } from "@/features/chat/components/chat-header";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return (
    <div className="h-screen overflow-hidden w-full flex">
      <ChatSidebar />
      <SidebarInset>
        <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
          <ChatHeader />
          <main className="flex flex-col flex-1 overflow-hidden relative">
            {children}
          </main>
        </div>
      </SidebarInset>
    </div>
  );
}

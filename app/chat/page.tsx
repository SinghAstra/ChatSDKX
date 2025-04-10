"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import React from "react";

const ChatPage = () => {
  const { open, setOpen } = useSidebar();
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center gap-2 p-2">
        <SidebarTrigger />{" "}
        {!open && (
          <span
            className="text-lg font-medium cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {siteConfig.name}
          </span>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center"></div>
    </div>
  );
};

export default ChatPage;

"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import React from "react";
import { ModelSelector } from "./model-selector";
import { SidebarToggle } from "./sidebar-toggle";

const ChatPage = () => {
  const { open, setOpen } = useSidebar();
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center gap-2 p-2">
        <div className="flex items-center gap-2">
          <SidebarToggle />{" "}
          {!open && (
            <span
              className="text-lg font-medium cursor-pointer"
              onClick={() => setOpen(true)}
            >
              {siteConfig.name}
            </span>
          )}
        </div>
        <ModelSelector />
      </div>
      <div className="flex-1 flex items-center justify-center"></div>
    </div>
  );
};

export default ChatPage;

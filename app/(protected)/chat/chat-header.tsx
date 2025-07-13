import { AvatarMenu } from "@/components/ui/avatar-menu";
import { siteConfig } from "@/config/site";
import type { User } from "next-auth";
import React from "react";
import { SidebarToggle } from "./sidebar-toggle";

const ChatHeader = ({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
}) => {
  return (
    <header
      className={`flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm sticky top-0 z-20 transition-all duration-200 ${
        open ? "left-64" : "left-0"
      }`}
    >
      {!open && (
        <div className="flex items-center gap-4">
          <SidebarToggle />
          <h1
            className="text-xl font-semibold text-foreground cursor-pointer hover:text-muted-foreground transition-colors"
            onClick={() => setOpen(true)}
          >
            {siteConfig.name}
          </h1>
        </div>
      )}
      <AvatarMenu user={user} />
    </header>
  );
};

export default ChatHeader;

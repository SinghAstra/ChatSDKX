"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "./logo";

import { useChatList } from "../hooks/use-chat-list";
import { useDeleteChat } from "../hooks/use-delete-chat";
import { useUpdateChatTitle } from "../hooks/use-update-chat-title";
import { ChatSidebarItem } from "./chat-sidebar-item";

export function ChatSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();

  const pathname = usePathname();

  const { chats = [], isLoading: isChatsLoading } = useChatList();

  const { mutateAsync: deleteChat } = useDeleteChat();

  const { mutateAsync: updateTitle } = useUpdateChatTitle();

  const getButtonStyles = (isActive: boolean): string => {
    return cn(
      "!bg-transparent !text-muted-foreground transition-colors duration-200",
      "hover:!bg-sidebar-accent hover:!text-foreground",
      isActive && "!bg-sidebar-accent !text-foreground"
    );
  };

  const handleMobileNavigationClose = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleNewChat = () => {
    window.location.href = ROUTES.CHAT;

    handleMobileNavigationClose();
  };

  return (
    <Sidebar
      className="bg-sidebar border-r border-sidebar-border"
      collapsible="icon"
    >
      {/* 1. Header Area (Collapsible Logo & Site Name) */}
      <SidebarHeader className="border-b border-sidebar-border flex flex-row items-center justify-between p-2 group-data-[collapsible=icon]:justify-center">
        {state === "expanded" ? (
          <>
            <Link
              href={ROUTES.CHAT}
              className="flex items-center gap-2"
              onClick={handleMobileNavigationClose}
            >
              <div className="p-1.5 rounded-lg bg-background">
                <Logo size={20} className="text-foreground" />
              </div>
              <span className="text-sidebar-foreground font-semibold">
                {siteConfig.name}
              </span>
            </Link>
            <SidebarTrigger className="ml-auto" />
          </>
        ) : (
          <div className="group/toggle relative flex size-8 items-center justify-center">
            <SidebarTrigger className="size-full absolute inset-0 [>&_svg]:size-4" />
            <div className="absolute p-1.5 rounded-lg bg-sidebar pointer-events-none transition-opacity duration-200 group-hover/toggle:opacity-0 flex items-center justify-center backface-hidden">
              <Logo size={20} className="text-foreground" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* 2. Primary Action Group (New Chat) */}
        <SidebarGroup className="animate-in fade-in duration-400">
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === ROUTES.CHAT}
                  className={cn(
                    getButtonStyles(pathname === ROUTES.CHAT),
                    "border border-border/60 flex items-center gap-1 cursor-pointer"
                  )}
                  onClick={handleNewChat}
                >
                  <Plus className="w-4 h-4" />
                  <span>New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 3. Dynamic Chat List (Only shows when expanded) */}
        {state === "expanded" && (
          <SidebarGroup className="border-t border-sidebar-border/40 pt-2 animate-in fade-in duration-700">
            <SidebarGroupContent className="mt-1">
              <SidebarMenu className="flex flex-col gap-0.5">
                {isChatsLoading ? (
                  // Initial fetching state
                  Array.from({ length: 4 }).map((_, index) => (
                    <SidebarMenuItem key={index} className="w-full">
                      <div className="flex items-center gap-2.5 w-full p-2">
                        <Skeleton className="h-6 w-6 shrink-0 rounded bg-sidebar-accent/50" />
                        <Skeleton className="h-4 w-2/3 rounded bg-sidebar-accent/50" />
                      </div>
                    </SidebarMenuItem>
                  ))
                ) : chats.length === 0 ? (
                  // Empty state
                  <div className="px-3 py-4 text-xs italic text-muted-foreground/40 font-sans tracking-wide select-none">
                    No chats yet.
                  </div>
                ) : (
                  // Chat List
                  chats.map((chat) => {
                    const targetUrl = `/chat/${chat.id}`;

                    const isActive = pathname === targetUrl;

                    return (
                      <ChatSidebarItem
                        key={chat.id}
                        chat={chat}
                        isActive={isActive}
                        targetUrl={targetUrl}
                        buttonStyles={getButtonStyles(isActive)}
                        onNavigate={handleMobileNavigationClose}
                        onRename={(newTitle) =>
                          updateTitle({ chatId: chat.id, title: newTitle })
                        }
                        onDelete={() => deleteChat(chat.id)}
                      />
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

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
import { useChats } from "@/features/chat/hooks/use-chats";
import { useDeleteChat } from "@/features/chat/hooks/use-delete-chat";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Logo } from "./logo";
import { SidebarChatItem } from "./sidebar-chat-item";

const navItems = [{ title: "New Chat", url: ROUTES.CHAT, icon: Plus }];

export function ChatSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();

  const pathname = usePathname();

  const router = useRouter();

  const { data: chats = [], isLoading: isChatsLoading } = useChats();

  const { mutateAsync: deleteChat, isPending: isDeleting } = useDeleteChat();

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

  const handleDeleteExecution = async (id: string) => {
    toast.promise(deleteChat(id), {
      loading: "Deleting chat history...",
      success: "Chat deleted successfully",
      error: "Failed to delete chat",
    });

    if (pathname === `/chat/${id}`) {
      router.push(ROUTES.CHAT);
    }
  };

  return (
    <Sidebar
      className="bg-sidebar border-r border-sidebar-border"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border flex flex-row items-center justify-between p-2 group-data-[collapsible=icon]:justify-center">
        {state === "expanded" ? (
          <>
            <Link
              href="/"
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
        <SidebarGroup className="animate-in fade-in duration-400">
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.url;

                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        getButtonStyles(isActive),
                        "border border-border/60"
                      )}
                    >
                      <Link
                        href={item.url}
                        onClick={handleMobileNavigationClose}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state === "expanded" && (
          <SidebarGroup className="border-t border-sidebar-border/40 pt-2 animate-in fade-in duration-700">
            <SidebarGroupContent className="mt-1">
              <SidebarMenu className="flex flex-col gap-0.5">
                {isChatsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <SidebarMenuItem key={index} className="w-full">
                      <div className="flex items-center gap-2.5 w-full p-2">
                        <Skeleton className="h-6 w-6 shrink-0 rounded bg-sidebar-accent/50" />
                        <Skeleton className="h-4 w-2/3 rounded bg-sidebar-accent/50" />
                      </div>
                    </SidebarMenuItem>
                  ))
                ) : chats.length === 0 ? (
                  <div className="px-3 py-4 text-xs italic text-muted-foreground/40 font-sans tracking-wide select-none">
                    No recent chats.
                  </div>
                ) : (
                  chats.map((chat) => {
                    const targetUrl = `/chat/${chat.id}`;

                    const isActive = pathname === targetUrl;

                    return (
                      <SidebarChatItem
                        key={chat.id}
                        chat={chat}
                        isActive={isActive}
                        isDeleting={isDeleting}
                        targetUrl={targetUrl}
                        onCloseMobile={handleMobileNavigationClose}
                        onDelete={handleDeleteExecution}
                        buttonStyles={getButtonStyles(isActive)}
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

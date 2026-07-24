"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface SidebarChatItemProps {
  chat: {
    id: string;
    title: string | null;
    isLoading?: boolean;
  };
  isActive: boolean;
  isDeleting: boolean;
  targetUrl: string;
  onCloseMobile: () => void;
  onDelete: (id: string) => void;
  buttonStyles?: string;
}

export function SidebarChatItem({
  chat,
  isActive,
  isDeleting,
  targetUrl,
  onCloseMobile,
  onDelete,
  buttonStyles,
}: SidebarChatItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(chat.id);
    setIsDialogOpen(false);
  };

  // 1. Pure Structural Skeleton View (Renders while chat is creating/naming)
  if (chat.isLoading) {
    return (
      <SidebarMenuItem className="flex items-center w-full px-2 py-1.5 gap-2.5">
        {/* Icon Skeleton */}
        <div className="h-6 w-6 shrink-0 rounded-md bg-sidebar-foreground/10 animate-pulse" />
        {/* Text Line Skeleton */}
        <div className="h-3.5 w-2/3 rounded bg-sidebar-foreground/10 animate-pulse" />
      </SidebarMenuItem>
    );
  }

  // 2. Standard Interactive Chat View
  return (
    <SidebarMenuItem className="group/menu-item relative flex items-center w-full">
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(buttonStyles, "w-full pr-10 transition-all duration-200")}
      >
        <Link
          href={targetUrl}
          onClick={onCloseMobile}
          className="cursor-pointer flex items-center gap-2.5 w-full"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-background border text-muted-foreground">
            <MessageSquare className="size-3.5" />
          </div>

          <span className="truncate text-sm font-medium tracking-tight">
            {chat.title || "Untitled Chat"}
          </span>
        </Link>
      </SidebarMenuButton>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <button
            className="opacity-0 group-hover/menu-item:opacity-100 p-1 rounded hover:bg-sidebar-accent text-muted-foreground hover:text-destructive transition-all duration-150 ease-in-out scale-95 group-hover/menu-item:scale-100 focus:opacity-100 cursor-pointer outline-none animate-in fade-in slide-in-from-right-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDialogOpen(true);
            }}
            disabled={isDeleting}
            aria-label="Delete chat thread"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>

        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation thread?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <span className="font-semibold text-foreground">
                {chat.title || "Untitled Chat"}
              </span>{" "}
              chat history and remove all associated message records from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="p-2">
            <AlertDialogCancel
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDialogOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarMenuItem>
  );
}

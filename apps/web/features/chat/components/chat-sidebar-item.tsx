import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatBase, logError } from "@repo/shared";
import {
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ChatSidebarItemProps {
  chat: ChatBase;
  isActive: boolean;
  targetUrl: string;
  buttonStyles: string;
  onNavigate: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRename: (newTitle: string) => Promise<any>;
  onDelete: () => void;
}

export function ChatSidebarItem({
  chat,
  isActive,
  targetUrl,
  buttonStyles,
  onNavigate,
  onRename,
  onDelete,
}: ChatSidebarItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [editValue, setEditValue] = useState(chat.title || "");

  const [isRenaming, setIsRenaming] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();

      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveRename = async () => {
    if (!editValue.trim() || editValue === chat.title) {
      setIsEditing(false);

      return;
    }

    setIsRenaming(true);

    try {
      await onRename(editValue.trim());

      setIsEditing(false);
    } catch (error) {
      logError(error);

      setEditValue(chat.title || "");

      inputRef.current?.focus();
    } finally {
      setIsRenaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveRename();
    } else if (e.key === "Escape") {
      setIsEditing(false);

      setEditValue(chat.title || "");
    }
  };

  // State 1: Title Generating (Skeleton)
  if (chat.title === null) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton disabled className="opacity-70 bg-transparent">
          <Loader2 className="size-4 animate-spin text-primary shrink-0" />
          <div className="flex flex-col gap-1 w-full overflow-hidden">
            <Skeleton className="h-3.5 w-[80%] bg-sidebar-foreground/10" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // State 2: Renaming Input
  if (isEditing) {
    return (
      <SidebarMenuItem>
        <div className="flex items-center w-full gap-2 px-2 py-1.5">
          <MessageSquare className="size-4 shrink-0 text-sidebar-foreground/50" />
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveRename}
            disabled={isRenaming}
            className="h-7 text-sm px-2 bg-background shadow-none focus-visible:ring-1 focus-visible:ring-sidebar-ring"
          />
        </div>
      </SidebarMenuItem>
    );
  }

  // State 3: Normal Link with Context Menu
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={chat.title}
        className={buttonStyles}
      >
        <Link href={targetUrl} onClick={onNavigate}>
          <MessageSquare className="size-4 shrink-0" />
          <span className="truncate">{chat.title}</span>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded"
          side="right"
          align="start"
        >
          <DropdownMenuItem
            onClick={() => {
              setEditValue(chat.title || "");

              setIsEditing(true);
            }}
            className="gap-2 cursor-pointer"
          >
            <Pencil className="size-4 text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDelete}
            className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="size-4" />
            <span>Delete chat</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/routes";
import { LogOut, Menu, Plus, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

interface ChatHeaderProps {
  title?: string | null;
}

export function ChatHeader({ title }: ChatHeaderProps) {
  const { toggleSidebar } = useSidebar();

  const { data: session } = useSession();

  const pathname = usePathname();

  const isRootChat = pathname === ROUTES.CHAT;

  const handleLogout = async () => {
    await signOut({ callbackUrl: ROUTES.SIGN_IN });
  };

  const getUserInitials = () => {
    if (!session?.user?.name) return null;

    return session.user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex w-full items-center justify-between py-2 px-3 md:px-4">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden shrink-0"
          aria-label="Toggle Sidebar"
        >
          <Menu className="size-5 text-foreground/70" />
        </Button>

        {/* Dynamic Title / Brand Display */}
        {isRootChat ? (
          <Link
            href={ROUTES.CHAT}
            className="flex items-center gap-2 md:hidden"
          >
            <div className="p-1 rounded-lg bg-background">
              <Logo size={20} className="text-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {siteConfig.name}
            </span>
          </Link>
        ) : (
          title && (
            <h1 className="truncate text-sm font-medium text-foreground">
              {title}
            </h1>
          )
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2.5 shrink-0 ml-auto">
        <button
          className="text-foreground/70 bg-muted/50 hover:bg-muted/70 hover:text-foreground hidden sm:flex px-2.5 py-2 border rounded cursor-pointer"
          title="New Chat"
        >
          <Link href={ROUTES.CHAT}>
            <Plus className="size-4" />
            <span className="sr-only">New Chat</span>
          </Link>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0 flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer border"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.image || undefined}
                  alt={session?.user?.name || "User profile"}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">
                  {getUserInitials() || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name || "User Account"}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {session?.user?.email || "No email available"}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="sm:hidden cursor-pointer">
              <Link href={ROUTES.CHAT} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

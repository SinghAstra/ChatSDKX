import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Chat } from "@prisma/client";
import Link from "next/link";

export const ChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => {
  return (
    <SidebarMenuItem className="rounded-xs">
      <SidebarMenuButton className="rounded-xs" asChild isActive={isActive}>
        <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
          <span>{chat.title}</span>
          {/* <Button className="hidden" onClick={() => onDelete(chat.id)}></Button> */}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

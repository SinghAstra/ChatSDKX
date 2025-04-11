import { SidebarProvider } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { AppSidebar } from "./sidebar";

interface ChatLayoutProps {
  children: ReactNode;
}

export async function generateMetadata() {
  return {
    title: `New Chat`,
    description: `Start a new Chat`,
  };
}

const ChatLayout = async ({ children }: ChatLayoutProps) => {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const initialSidebarState =
    cookieStore.get("sidebar-state")?.value === "true";
  const initialChatModelId = cookieStore.get("chat-model")?.value;
  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider defaultOpen={initialSidebarState}>
      <AppSidebar user={session.user} />
      <main>{children}</main>
    </SidebarProvider>
  );
};

export default ChatLayout;

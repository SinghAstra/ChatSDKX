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

const ChatLayout = async ({ children }: ChatLayoutProps) => {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const initialSidebarState =
    cookieStore.get("sidebar-state")?.value === "true";
  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider defaultOpen={initialSidebarState}>
      <AppSidebar user={session.user} />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
};

export default ChatLayout;

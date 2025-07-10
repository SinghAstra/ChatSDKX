import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/chat");
  }

  return children;
};

export default HomeLayout;

import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
  const session = await getServerSession(authOptions);
  const isLoggedIn = session ? true : false;

  if (isLoggedIn) {
    redirect("/chat");
  }
  return children;
};

export default AuthLayout;

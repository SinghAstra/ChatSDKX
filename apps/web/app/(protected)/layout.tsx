import React from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  // const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: repoKeys.lists(),
  //   queryFn: repoListQueryFn,
  // });

  return <div className="flex h-screen bg-background w-full">{children}</div>;
}

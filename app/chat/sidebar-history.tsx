import { User } from "next-auth";
import React from "react";

interface SidebarHistoryProps {
  user: User;
}

const SidebarHistory = ({ user }: SidebarHistoryProps) => {
  return <div>SidebarHistory</div>;
};

export default SidebarHistory;

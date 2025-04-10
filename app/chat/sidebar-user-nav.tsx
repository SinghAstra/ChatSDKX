import { User } from "next-auth";
import React from "react";

interface SidebarUserNavProps {
  user: User;
}

const SidebarUserNav = ({ user }: SidebarUserNavProps) => {
  return <div>SidebarUserNav</div>;
};

export default SidebarUserNav;

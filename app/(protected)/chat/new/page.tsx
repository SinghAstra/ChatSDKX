import { redirect } from "next/navigation";
import React from "react";

const NewChatPage = () => {
  redirect("/chat");
  return <div>NewChatPage</div>;
};

export default NewChatPage;

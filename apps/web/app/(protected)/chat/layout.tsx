import { ChatHeader } from "@/features/chat/components/header";

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ChatHeader />
      <main className="flex flex-col flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default ChatLayout;

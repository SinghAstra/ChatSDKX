import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInputForm } from "@/features/chat/components/chat-input-form";

export default function ChatPage() {
  return (
    <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto overflow-hidden">
      <div className="flex flex-col flex-1 overflow-y-auto p-4 justify-center">
        <ChatEmptyState />
      </div>

      <div className="p-4 bg-background shrink-0">
        <ChatInputForm />
      </div>
    </div>
  );
}

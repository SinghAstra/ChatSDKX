import { ChatEmptyState } from "@/features/chat/components/chat-empty-state";
import { ChatInputForm } from "@/features/chat/components/chat-input-form";

export default function ChatPage() {
  return (
    <div className="flex flex-col fllex-1  max-w-4xl mx-auto w-full">
      <div className="flex-1 flex flex-col justify-center overflow-y-auto p-4">
        <ChatEmptyState />
      </div>

      <div className="p-4 bg-background">
        <ChatInputForm />
      </div>
    </div>
  );
}

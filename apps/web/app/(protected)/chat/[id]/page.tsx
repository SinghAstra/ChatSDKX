import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getChatThreadAction } from "@/features/chat/actions/get-chat-thread";
import { chatKeys } from "@/features/chat/api/query-keys";
import { ChatView } from "@/features/chat/components/chat-view";
import { ChatHeader } from "@/features/chat/components/chat-header";

interface ChatThreadPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatThreadPage({ params }: ChatThreadPageProps) {
  const { id: chatId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: chatKeys.detail(chatId),
    queryFn: async () => {
      const res = await getChatThreadAction(chatId);

      return res.success ? res.data : null;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatHeader chatId={chatId} />
      <ChatView chatId={chatId} />
    </HydrationBoundary>
  );
}

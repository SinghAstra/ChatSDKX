import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPromptSuggestionsAction } from "@/features/chat/actions/get-prompt-suggestions";
import { chatKeys } from "@/features/chat/api/query-keys";
import { ChatView } from "@/features/chat/components/chat-view";

export default async function ChatPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: chatKeys.suggestions(),
    queryFn: async () => {
      const res = await getPromptSuggestionsAction();

      return res.success ? res.data : [];
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatView />
    </HydrationBoundary>
  );
}

import { ConversationIdView } from "@/features/dashboard/views/ConversationIdView";

import { Id } from "@workspace/backend/_generated/dataModel";

interface Props {
  params: Promise<{ conversationsId: string }>;
}

async function ConversationsIdPage({ params }: Props) {
  const { conversationsId } = await params;

  return (
    <ConversationIdView
      conversationId={conversationsId as Id<"conversations">}
    />
  );
}

export default ConversationsIdPage;

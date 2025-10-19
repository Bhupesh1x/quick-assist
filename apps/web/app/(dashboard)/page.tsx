import { ConversationsView } from "@/features/dashboard/views/ConversationsView";
import { ConversationLayout } from "@/features/dashboard/layouts/ConversationLayout";

function Page() {
  return (
    <ConversationLayout>
      <ConversationsView />
    </ConversationLayout>
  );
}

export default Page;

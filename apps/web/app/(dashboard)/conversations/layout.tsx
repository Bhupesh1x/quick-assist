import { ConversationLayout } from "@/features/dashboard/layouts/ConversationLayout";

interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
  return <ConversationLayout>{children}</ConversationLayout>;
}

export default layout;

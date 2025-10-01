import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";

import { ConversationPanel } from "../components/ConversationPanel";

interface Props {
  children: React.ReactNode;
}

export function ConversationLayout({ children }: Props) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel minSize={20} maxSize={30} defaultSize={20}>
        <ConversationPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
}

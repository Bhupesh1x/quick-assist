"use client";

import { useAtomValue } from "jotai";

import { screenAtom } from "../atoms/WidgetAtom";

import { WidgetChatScreen } from "../screens/WidgetChatScreen";
import { WidgetAuthScreen } from "../screens/WidgetAuthScreen";
import { WidgetVoiceScreen } from "../screens/WidgetVoiceScreen";
import { WidgetErrorScreen } from "../screens/WidgetErrorScreen";
import { WidgetInboxScreen } from "../screens/WidgetInboxScreen";
import { WidgetLoadingScreen } from "../screens/WidgetLoadingScreen";
import { WidgetSelectionScreen } from "../screens/WidgetSelectionScreen";

interface Props {
  organizationId: string | null;
}

export function WidgetView({ organizationId }: Props) {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    error: <WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    voice: <WidgetVoiceScreen />,
    inbox: <WidgetInboxScreen />,
    selection: <WidgetSelectionScreen />,
    chat: <WidgetChatScreen />,
    contact: <p>TODO: Contact</p>,
  };

  return (
    <main className="w-full h-full border bg-muted rounded-xl flex flex-col overflow-hidden">
      {screenComponents[screen]}
    </main>
  );
}

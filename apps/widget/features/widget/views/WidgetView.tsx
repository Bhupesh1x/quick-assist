"use client";

import { useAtomValue } from "jotai";

import { screenAtom } from "../atoms/WidgetAtom";

import { WidgetAuthScreen } from "../screens/WidgetAuthScreen";
import { WidgetErrorScreen } from "../screens/WidgetErrorScreen";
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
    voice: <p>TODO: Voice</p>,
    inbox: <p>TODO: Inbox</p>,
    selection: <WidgetSelectionScreen />,
    chat: <p>TODO: chat</p>,
    contact: <p>TODO: Contact</p>,
  };

  return (
    <main className="min-h-screen w-full h-full border bg-muted rounded-xl flex flex-col overflow-hidden">
      {screenComponents[screen]}
    </main>
  );
}

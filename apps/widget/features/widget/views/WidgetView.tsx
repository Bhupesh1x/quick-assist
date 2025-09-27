"use client";

import { useAtomValue } from "jotai";

import { screenAtom } from "../atoms/WidgetAtom";
import { WidgetAuthScreen } from "../screens/WidgetAuthScreen";
import { WidgetErrorScreen } from "../screens/WidgetErrorScreen";

interface Props {
  organizationId: string;
}

export function WidgetView({ organizationId }: Props) {
  const screen = useAtomValue(screenAtom);

  const screenComponents = {
    error: <WidgetErrorScreen />,
    loading: <p>TODO: Loading</p>,
    auth: <WidgetAuthScreen />,
    voice: <p>TODO: Voice</p>,
    inbox: <p>TODO: Inbox</p>,
    selection: <p>TODO: selection</p>,
    chat: <p>TODO: chat</p>,
    contact: <p>TODO: Contact</p>,
  };

  return (
    <main className="min-h-screen w-full h-full border bg-muted rounded-xl flex flex-col overflow-hidden">
      {screenComponents[screen]}
    </main>
  );
}
